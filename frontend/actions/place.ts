"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { deleteS3Prefix } from "@/lib/s3";
import {
  type CreatePlaceActionResponse,
  CreatePlaceSchema,
} from "@/types/place";

export type DeletePlaceResponse =
  | { success: true }
  | { success: false; message: string };

export async function createPlace(
  _prevState: CreatePlaceActionResponse,
  formData: FormData,
): Promise<CreatePlaceActionResponse> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "host") {
    return { success: false, message: "Not authorized" };
  }

  const result = CreatePlaceSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!result.success) {
    return {
      success: false,
      message: "Invalid data",
      error: z.flattenError(result.error),
    };
  }

  const data = result.data;

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
      select: { userId: true },
    });
    if (!category || category.userId !== session.user.id) {
      return {
        success: false,
        message: "Invalid category",
        error: {
          formErrors: [],
          fieldErrors: { categoryId: ["Invalid category"] },
        },
      };
    }
  }

  let placeId: string;
  try {
    const created = await prisma.place.create({
      data: {
        name: data.name,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        openingHours: data.openingHours,
        entryFee: data.entryFee,
        travelTips: data.travelTips,
        dressCode: data.dressCode,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        address: data.address ?? null,
        categoryId: data.categoryId ?? null,
        userId: session.user.id,
      },
      select: { id: true },
    });
    placeId = created.id;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return {
        success: false,
        message: "You already have a place with this name",
        error: {
          formErrors: [],
          fieldErrors: { name: ["Name must be unique"] },
        },
      };
    }
    console.error("Failed to create place", error);
    return { success: false, message: "Failed to create place" };
  }

  revalidatePath("/host/places");
  return { success: true, message: "Place created", placeId };
}

export async function deletePlace(
  placeId: string,
): Promise<DeletePlaceResponse> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "host") {
    return { success: false, message: "Not authorized" };
  }

  const place = await prisma.place.findUnique({
    where: { id: placeId },
    select: { id: true, userId: true },
  });

  if (!place || place.userId !== session.user.id) {
    return { success: false, message: "Not authorized" };
  }

  try {
    await prisma.place.delete({ where: { id: placeId } });
  } catch (error: unknown) {
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? (error as { code: string }).code
        : null;
    if (code !== "P2025") {
      console.error("Failed to delete place", error);
      return { success: false, message: "Failed to delete place" };
    }
  }

  try {
    await deleteS3Prefix(`places/${placeId}/`);
  } catch (err) {
    console.error("Failed to clean up S3 objects for place", placeId, err);
  }

  revalidatePath("/host/places");
  return { success: true };
}

export async function getTouristPlaces({
  q,
  categoryId,
}: {
  q?: string;
  categoryId?: string;
} = {}) {
  return prisma.place.findMany({
    where: {
      isActive: true,
      ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
      ...(categoryId ? { categoryId } : {}),
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTouristCategories() {
  return prisma.category.findMany({
    where: { places: { some: { isActive: true } } },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
    distinct: ["name"],
  });
}

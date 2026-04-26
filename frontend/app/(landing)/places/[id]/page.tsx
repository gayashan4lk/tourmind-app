import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

export default async function PublicPlaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const place = await prisma.place.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      shortDescription: true,
      fullDescription: true,
      openingHours: true,
      entryFee: true,
      travelTips: true,
      dressCode: true,
      latitude: true,
      longitude: true,
      address: true,
      isActive: true,
      category: { select: { name: true } },
      images: {
        where: { isPrimary: true },
        take: 1,
        select: { id: true, url: true },
      },
    },
  });

  if (!place || !place.isActive) {
    notFound();
  }

  const primary = place.images[0] ?? null;
  const hasLocation = place.latitude != null && place.longitude != null;
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const staticMapUrl =
    hasLocation && mapsApiKey
      ? `https://maps.googleapis.com/maps/api/staticmap?center=${place.latitude},${place.longitude}&zoom=14&size=600x300&scale=2&markers=color:red%7C${place.latitude},${place.longitude}&key=${mapsApiKey}`
      : null;

  return (
    <section className="mx-auto w-full max-w-5xl px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{place.name}</h1>
          {place.category?.name && (
            <p className="text-sm text-neutral-500">{place.category.name}</p>
          )}
        </div>
        <Button
          asChild
          variant="outline"
          className="h-9 rounded-full px-6 text-base font-semibold"
        >
          <Link href="/">Back</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-220/180 w-full overflow-hidden rounded-2xl bg-neutral-200">
            {primary && (
              <Image
                src={primary.url}
                alt={place.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 text-sm">
          <div>
            <p className="font-medium">Short description</p>
            <p className="text-neutral-600">{place.shortDescription}</p>
          </div>
          <div>
            <p className="font-medium">Full description</p>
            <p className="whitespace-pre-wrap text-neutral-600">
              {place.fullDescription}
            </p>
          </div>
          <div>
            <p className="font-medium">Opening hours</p>
            <p className="text-neutral-600">{place.openingHours}</p>
          </div>
          <div>
            <p className="font-medium">Entry fee</p>
            <p className="text-neutral-600">{place.entryFee}</p>
          </div>
          {place.travelTips && (
            <div>
              <p className="font-medium">Travel tips</p>
              <p className="whitespace-pre-wrap text-neutral-600">
                {place.travelTips}
              </p>
            </div>
          )}
          {place.dressCode && (
            <div>
              <p className="font-medium">Dress code</p>
              <p className="whitespace-pre-wrap text-neutral-600">
                {place.dressCode}
              </p>
            </div>
          )}
          {hasLocation && (
            <div>
              <p className="font-medium">Location</p>
              {place.address && (
                <p className="text-neutral-600">{place.address}</p>
              )}
              {staticMapUrl && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block overflow-hidden rounded-md border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={staticMapUrl}
                    alt={`Map showing ${place.name}`}
                    width={600}
                    height={300}
                    className="h-auto w-full"
                  />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

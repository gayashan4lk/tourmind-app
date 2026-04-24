'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import {
	CreatePlaceActionResponse,
	CreatePlaceSchema,
} from '@/types/place'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export async function createPlace(
	_prevState: CreatePlaceActionResponse,
	formData: FormData,
): Promise<CreatePlaceActionResponse> {
	const session = await auth.api.getSession({ headers: await headers() })

	if (!session || session.user.role !== 'host') {
		return { success: false, message: 'Not authorized' }
	}

	const result = CreatePlaceSchema.safeParse(
		Object.fromEntries(formData.entries()),
	)

	if (!result.success) {
		return {
			success: false,
			message: 'Invalid data',
			error: z.flattenError(result.error),
		}
	}

	const data = result.data

	if (data.categoryId) {
		const category = await prisma.category.findUnique({
			where: { id: data.categoryId },
			select: { userId: true },
		})
		if (!category || category.userId !== session.user.id) {
			return {
				success: false,
				message: 'Invalid category',
				error: {
					formErrors: [],
					fieldErrors: { categoryId: ['Invalid category'] },
				},
			}
		}
	}

	try {
		await prisma.place.create({
			data: {
				name: data.name,
				shortDescription: data.shortDescription,
				fullDescription: data.fullDescription,
				openingHours: data.openingHours,
				entryFee: data.entryFee,
				travelTips: data.travelTips,
				dressCode: data.dressCode,
				categoryId: data.categoryId ?? null,
				userId: session.user.id,
			},
		})
	} catch (error: unknown) {
		if (
			typeof error === 'object' &&
			error !== null &&
			'code' in error &&
			(error as { code: string }).code === 'P2002'
		) {
			return {
				success: false,
				message: 'You already have a place with this name',
				error: {
					formErrors: [],
					fieldErrors: { name: ['Name must be unique'] },
				},
			}
		}
		console.error('Failed to create place', error)
		return { success: false, message: 'Failed to create place' }
	}

	revalidatePath('/host/places')
	redirect('/host/places')
}

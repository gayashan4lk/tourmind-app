'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import {
	type CreateTourActionResponse,
	CreateTourSchema,
} from '@/types/tour'

export async function createTour(
	_prevState: CreateTourActionResponse,
	formData: FormData,
): Promise<CreateTourActionResponse> {
	const session = await auth.api.getSession({ headers: await headers() })

	if (!session || session.user.role !== 'tourist') {
		return { success: false, message: 'Not authorized' }
	}

	let placeIds: unknown
	try {
		placeIds = JSON.parse(String(formData.get('placeIds') ?? '[]'))
	} catch {
		return {
			success: false,
			message: 'Invalid places',
			error: {
				formErrors: [],
				fieldErrors: { placeIds: ['Invalid places'] },
			},
		}
	}

	const result = CreateTourSchema.safeParse({
		title: formData.get('title'),
		description: formData.get('description') ?? '',
		placeIds,
	})

	if (!result.success) {
		return {
			success: false,
			message: 'Invalid data',
			error: z.flattenError(result.error),
		}
	}

	const data = result.data

	const uniqueIds = Array.from(new Set(data.placeIds))
	const foundPlaces = await prisma.place.findMany({
		where: { id: { in: uniqueIds }, isActive: true },
		select: { id: true },
	})

	if (foundPlaces.length !== uniqueIds.length) {
		return {
			success: false,
			message: 'One or more selected places are unavailable',
			error: {
				formErrors: [],
				fieldErrors: { placeIds: ['One or more selected places are unavailable'] },
			},
		}
	}

	let tourId: string
	try {
		const created = await prisma.$transaction(async (tx) => {
			const tour = await tx.tour.create({
				data: {
					title: data.title,
					description: data.description ?? null,
					userId: session.user.id,
				},
				select: { id: true },
			})
			await tx.tourItem.createMany({
				data: data.placeIds.map((placeId, position) => ({
					tourId: tour.id,
					placeId,
					position,
				})),
			})
			return tour
		})
		tourId = created.id
	} catch (error) {
		console.error('Failed to create tour', error)
		return { success: false, message: 'Failed to create tour' }
	}

	revalidatePath('/tour/my-tours')
	return { success: true, message: 'Tour created', tourId }
}

export async function getMyTour(id: string) {
	const session = await auth.api.getSession({ headers: await headers() })

	if (!session || session.user.role !== 'tourist') {
		return null
	}

	const tour = await prisma.tour.findUnique({
		where: { id },
		select: {
			id: true,
			title: true,
			description: true,
			createdAt: true,
			userId: true,
			items: {
				orderBy: { position: 'asc' },
				select: {
					id: true,
					position: true,
					place: {
						select: {
							id: true,
							name: true,
							shortDescription: true,
							fullDescription: true,
							openingHours: true,
							entryFee: true,
							travelTips: true,
							dressCode: true,
							isActive: true,
							category: { select: { name: true } },
							images: {
								where: { isPrimary: true },
								take: 1,
								select: { url: true },
							},
						},
					},
				},
			},
		},
	})

	if (!tour || tour.userId !== session.user.id) {
		return null
	}

	return tour
}

export async function getMyTours() {
	const session = await auth.api.getSession({ headers: await headers() })

	if (!session || session.user.role !== 'tourist') {
		return []
	}

	return prisma.tour.findMany({
		where: { userId: session.user.id },
		select: {
			id: true,
			title: true,
			description: true,
			createdAt: true,
			_count: { select: { items: true } },
		},
		orderBy: { createdAt: 'desc' },
	})
}

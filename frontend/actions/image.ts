'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { buildPublicUrl, s3, S3_BUCKET } from '@/lib/s3'
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MIME_EXT: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
}

export type GetUploadUrlResponse =
	| { success: true; uploadUrl: string; publicUrl: string; key: string }
	| { success: false; message: string }

export type SaveImageResponse =
	| { success: true; imageId: string; url: string }
	| { success: false; message: string }

export type DeleteImageResponse =
	| { success: true }
	| { success: false; message: string }

type OwnershipCheck =
	| { ok: true; userId: string; placeId: string }
	| { ok: false; error: string }

async function requireHostOwnsPlace(placeId: string): Promise<OwnershipCheck> {
	const session = await auth.api.getSession({ headers: await headers() })
	if (!session || session.user.role !== 'host') {
		return { ok: false, error: 'Not authorized' }
	}
	const place = await prisma.place.findUnique({
		where: { id: placeId },
		select: { id: true, userId: true },
	})
	if (!place || place.userId !== session.user.id) {
		return { ok: false, error: 'Not authorized' }
	}
	return { ok: true, userId: session.user.id, placeId: place.id }
}

export async function getPlaceImageUploadUrl(
	placeId: string,
	fileType: string,
	fileSize: number,
): Promise<GetUploadUrlResponse> {
	const authResult = await requireHostOwnsPlace(placeId)
	if (!authResult.ok) {
		return { success: false, message: authResult.error }
	}

	if (!ALLOWED_MIME.has(fileType)) {
		return { success: false, message: 'Only JPEG, PNG, or WebP allowed' }
	}
	if (!Number.isFinite(fileSize) || fileSize <= 0 || fileSize > MAX_FILE_SIZE) {
		return { success: false, message: 'File must be under 5 MB' }
	}

	const ext = MIME_EXT[fileType]
	const key = `places/${placeId}/${crypto.randomUUID()}.${ext}`

	const command = new PutObjectCommand({
		Bucket: S3_BUCKET,
		Key: key,
		ContentType: fileType,
		ContentLength: fileSize,
	})

	const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 })
	return {
		success: true,
		uploadUrl,
		publicUrl: buildPublicUrl(key),
		key,
	}
}

export async function savePlaceImage(
	placeId: string,
	url: string,
): Promise<SaveImageResponse> {
	const authResult = await requireHostOwnsPlace(placeId)
	if (!authResult.ok) {
		return { success: false, message: authResult.error }
	}

	const expectedPrefix = buildPublicUrl(`places/${placeId}/`)
	if (!url.startsWith(expectedPrefix)) {
		return { success: false, message: 'Invalid image URL' }
	}

	const existing = await prisma.image.findMany({
		where: { placeId, isPrimary: true },
		select: { id: true, url: true },
	})

	const image = await prisma.$transaction(async (tx) => {
		if (existing.length > 0) {
			await tx.image.deleteMany({
				where: { id: { in: existing.map((e) => e.id) } },
			})
		}
		return tx.image.create({
			data: { placeId, url, isPrimary: true },
			select: { id: true, url: true },
		})
	})

	for (const old of existing) {
		const oldKey = extractKey(old.url)
		if (oldKey) {
			try {
				await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: oldKey }))
			} catch (err) {
				console.error('Failed to delete old S3 object', oldKey, err)
			}
		}
	}

	revalidatePath('/host/places')
	revalidatePath(`/host/places/${placeId}`)
	return { success: true, imageId: image.id, url: image.url }
}

export async function deletePlaceImage(
	imageId: string,
): Promise<DeleteImageResponse> {
	const session = await auth.api.getSession({ headers: await headers() })
	if (!session || session.user.role !== 'host') {
		return { success: false, message: 'Not authorized' }
	}

	const image = await prisma.image.findUnique({
		where: { id: imageId },
		select: { id: true, url: true, placeId: true, place: { select: { userId: true } } },
	})
	if (!image || image.place.userId !== session.user.id) {
		return { success: false, message: 'Not authorized' }
	}

	await prisma.image.delete({ where: { id: imageId } })

	const key = extractKey(image.url)
	if (key) {
		try {
			await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }))
		} catch (err) {
			console.error('Failed to delete S3 object', key, err)
		}
	}

	revalidatePath('/host/places')
	revalidatePath(`/host/places/${image.placeId}`)
	return { success: true }
}

function extractKey(url: string): string | null {
	const base = buildPublicUrl('')
	if (!url.startsWith(base)) return null
	return url.slice(base.length)
}

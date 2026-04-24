'use server'

import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3 } from '@/lib/s3'

export async function getUploadUrl(fileName: string, fileType: string) {
	if (!fileType.startsWith('image/')) {
		throw new Error('Only images allowed')
	}

	const command = new PutObjectCommand({
		Bucket: process.env.AWS_S3_BUCKET!,
		Key: fileName,
		ContentType: fileType,
	})

	const url = await getSignedUrl(s3, command, { expiresIn: 3000 })

	return url
}

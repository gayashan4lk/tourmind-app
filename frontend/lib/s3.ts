import {
	DeleteObjectsCommand,
	ListObjectsV2Command,
	S3Client,
} from '@aws-sdk/client-s3'

export const s3 = new S3Client({
	region: process.env.AWS_REGION!,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
})

export const S3_BUCKET = process.env.AWS_S3_BUCKET!

export function buildPublicUrl(key: string) {
	return `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
}

export async function deleteS3Prefix(prefix: string): Promise<void> {
	let continuationToken: string | undefined

	do {
		const listed = await s3.send(
			new ListObjectsV2Command({
				Bucket: S3_BUCKET,
				Prefix: prefix,
				ContinuationToken: continuationToken,
			}),
		)

		const keys = listed.Contents?.map((obj) => obj.Key).filter(
			(k): k is string => typeof k === 'string',
		)

		if (keys && keys.length > 0) {
			try {
				await s3.send(
					new DeleteObjectsCommand({
						Bucket: S3_BUCKET,
						Delete: {
							Objects: keys.map((Key) => ({ Key })),
							Quiet: true,
						},
					}),
				)
			} catch (err) {
				console.error('Failed to delete S3 batch under prefix', prefix, err)
			}
		}

		continuationToken = listed.IsTruncated
			? listed.NextContinuationToken
			: undefined
	} while (continuationToken)
}

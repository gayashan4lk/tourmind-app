import type { NextConfig } from 'next'

const bucket = process.env.AWS_S3_BUCKET
const region = process.env.AWS_REGION

const nextConfig: NextConfig = {
	experimental: {
		authInterrupts: true,
	},
	images: {
		remotePatterns:
			bucket && region
				? [
						{
							protocol: 'https',
							hostname: `${bucket}.s3.${region}.amazonaws.com`,
							pathname: '/**',
						},
					]
				: [],
	},
}

export default nextConfig

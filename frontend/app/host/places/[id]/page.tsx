import PlaceImageUpload from '@/components/place-image-upload'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export default async function HostPlaceDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	const session = await auth.api.getSession({ headers: await headers() })

	if (!session || session.user.role !== 'host') {
		redirect('/signin')
	}

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
			userId: true,
			category: { select: { name: true } },
			images: {
				where: { isPrimary: true },
				take: 1,
				select: { id: true, url: true },
			},
		},
	})

	if (!place || place.userId !== session.user.id) {
		notFound()
	}

	const primary = place.images[0] ?? null

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
					<Link href="/host/places">Back</Link>
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
				<div>
					<h2 className="mb-4 text-lg font-medium">Cover image</h2>
					<PlaceImageUpload
						placeId={place.id}
						currentImageUrl={primary?.url ?? null}
						currentImageId={primary?.id ?? null}
					/>
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
				</div>
			</div>
		</section>
	)
}

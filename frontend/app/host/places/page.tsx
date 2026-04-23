import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Plus } from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function HostPlacesPage() {
	const session = await auth.api.getSession({ headers: await headers() })

	if (!session || session.user.role !== 'host') {
		redirect('/signin')
	}

	const places = await prisma.place.findMany({
		where: { userId: session.user.id },
		orderBy: { createdAt: 'desc' },
		select: {
			id: true,
			name: true,
			shortDescription: true,
			openingHours: true,
			entryFee: true,
		},
	})

	return (
		<>
			<section className="mx-auto w-full max-w-7xl px-8 pt-8">
				<div className="flex justify-end">
					<Button
						asChild
						className="bg-brand-red hover:bg-brand-red/80 h-9 rounded-full px-6 text-base font-semibold text-white"
					>
						<Link href="/host/places/create">
							<Plus />
							Create Place
						</Link>
					</Button>
				</div>
			</section>

			<section className="mx-auto w-full max-w-7xl px-8 py-10">
				{places.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
						<p className="text-foreground text-lg font-medium">
							No places yet
						</p>
						<p className="text-sm text-neutral-500">
							Create your first place.
						</p>
					</div>
				) : (
					<ul className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
						{places.map((place) => (
							<li key={place.id}>
								<Link
									href={`/host/places/${place.id}`}
									className="flex flex-col gap-3"
								>
									<div className="aspect-220/180 w-full rounded-2xl bg-neutral-200" />
									<div className="text-sm leading-tight">
										<p className="text-foreground font-medium">{place.name}</p>
										<p className="text-neutral-400">{place.shortDescription}</p>
										<p className="text-neutral-400">{place.openingHours}</p>
										<p className="text-neutral-400">{place.entryFee}</p>
									</div>
								</Link>
							</li>
						))}
					</ul>
				)}
			</section>
		</>
	)
}

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

const places = Array.from({ length: 8 }, (_, i) => ({
	id: i,
	title: 'Tiny home in Matara',
	subtitle: 'A luxurious studio-style stay.',
	meta: '1 bedroom . 1 bed . 1 bath',
}))

export default function HostPlacesPage() {
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
				<ul className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
					{places.map((item) => (
						<li key={item.id} className="flex flex-col gap-3">
							<div className="aspect-220/180 w-full rounded-2xl bg-neutral-200" />
							<div className="text-sm leading-tight">
								<p className="text-foreground font-medium">{item.title}</p>
								<p className="text-neutral-400">{item.subtitle}</p>
								<p className="text-neutral-400">{item.meta}</p>
							</div>
						</li>
					))}
				</ul>
			</section>
		</>
	)
}

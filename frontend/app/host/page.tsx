import Link from 'next/link'
import { Button } from '@/components/ui/button'

const navItems = [
	{ label: 'Places', href: '/host', active: true },
	{ label: 'Categories', href: '/host/categories', active: false },
	{ label: 'Tags', href: '/host/tags', active: false },
]

const places = Array.from({ length: 8 }, (_, i) => ({
	id: i,
	title: 'Tiny home in Matara',
	subtitle: 'A luxurious studio-style stay.',
	meta: '1 bedroom . 1 bed . 1 bath',
}))

export default function HostPage() {
	return (
		<div className="flex flex-col">
			<header className="bg-[#d9d9d9]">
				<div className="mx-auto flex h-[98px] w-full max-w-7xl items-center justify-between px-8">
					<div className="flex items-center gap-14">
						<Link
							href="/host"
							className="text-brand-red text-3xl font-black tracking-tight"
						>
							TourMind
						</Link>
						<nav className="flex items-center gap-10">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className={
										item.active
											? 'text-brand-red decoration-brand-red text-base font-semibold underline decoration-3 underline-offset-4'
											: 'hover:text-brand-red hover:decoration-brand-red text-base font-semibold text-neutral-700 hover:text-base hover:underline hover:decoration-3 hover:underline-offset-4'
									}
								>
									{item.label}
								</Link>
							))}
						</nav>
					</div>
					<div
						className="bg-brand-red size-[51px] rounded-full"
						aria-label="User avatar"
					/>
				</div>
			</header>

			<section className="mx-auto w-full max-w-7xl px-8 pt-8">
				<div className="flex justify-end">
					<Button className="bg-brand-red hover:bg-brand-red/80 h-9 rounded-full px-6 text-base font-semibold text-white">
						Create Place
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
		</div>
	)
}

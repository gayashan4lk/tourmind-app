import { Search } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const listings = Array.from({ length: 8 }, (_, i) => ({
	id: i,
	title: 'Tiny home in Matara',
	subtitle: 'A luxurious studio-style stay.',
	meta: '1 bedroom . 1 bed . 1 bath',
}))

export default function LandingPage() {
	return (
		<div className="flex flex-col">
			<section className="relative bg-[#d9d9d9] pt-7 pb-20">
				<div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8">
					<Link
						href="/"
						className="text-brand-red text-3xl font-black tracking-tight"
					>
						TourMind
					</Link>
					<div className="flex items-center gap-3">
						<Button
							asChild
							className="h-8 rounded-full bg-neutral-700 px-5 text-xs text-white hover:bg-neutral-700/90"
						>
							<Link href="/signin">Log in</Link>
						</Button>
						<Button
							asChild
							className="h-8 rounded-full bg-[#e00b41] px-5 text-xs text-white hover:bg-[#e00b41]/90"
						>
							<Link href="/signup">Sign up</Link>
						</Button>
					</div>
				</div>

				<div className="mx-auto mt-16 flex w-full max-w-196 items-center rounded-full bg-white px-2 shadow-sm">
					<input
						type="search"
						placeholder="Search places in Matara"
						className="h-14 flex-1 rounded-full bg-transparent px-6 text-lg placeholder:text-[#b3b3b3] focus:outline-none"
					/>
					<Separator orientation="vertical" className="h-10" />
					<input
						type="text"
						placeholder="Category"
						className="h-14 w-44 bg-transparent px-6 text-lg placeholder:text-[#b3b3b3] focus:outline-none"
					/>
					<Separator orientation="vertical" className="h-10" />
					<input
						type="text"
						placeholder="Tag"
						className="h-14 w-44 bg-transparent px-6 text-lg placeholder:text-[#b3b3b3] focus:outline-none"
					/>
					<Button
						size="icon"
						aria-label="Search"
						className="bg-brand-red hover:bg-brand-red/90 size-11 rounded-full text-white"
					>
						<Search className="size-5" />
					</Button>
				</div>
			</section>

			<section className="mx-auto w-full max-w-7xl px-8 py-10">
				<ul className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
					{listings.map((item) => (
						<li key={item.id} className="flex flex-col gap-3">
							<div className="aspect-220/180 w-full rounded-2xl bg-[#d9d9d9]" />
							<div className="text-sm leading-tight">
								<p className="text-foreground font-medium">{item.title}</p>
								<p className="text-[#9e9e9e]">{item.subtitle}</p>
								<p className="text-[#9e9e9e]">{item.meta}</p>
							</div>
						</li>
					))}
				</ul>
			</section>
		</div>
	)
}

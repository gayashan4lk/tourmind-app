import Link from 'next/link'
import { getTouristCategories, getTouristPlaces } from '@/actions/place'
import { PlaceCard } from '@/app/tour/_components/place-card'
import { Button } from '@/components/ui/button'
import HomeSearchBar from './_components/home-search-bar'

export default async function LandingPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; categoryId?: string }>
}) {
	const { q, categoryId } = await searchParams
	const query = q?.trim() || undefined
	const activeCategoryId = categoryId?.trim() || undefined

	const [places, categories] = await Promise.all([
		getTouristPlaces({ q: query, categoryId: activeCategoryId }),
		getTouristCategories(),
	])

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
							className="hover:bg-brand-red h-8 rounded-full px-5 text-white"
						>
							<Link href="/signin">Log in</Link>
						</Button>
						<Button
							asChild
							className="hover:bg-brand-red/80 h-8 rounded-full px-5 text-white"
						>
							<Link href="/signup">Sign up</Link>
						</Button>
					</div>
				</div>

				<HomeSearchBar
					defaultQuery={query}
					categoryId={activeCategoryId}
					categories={categories}
				/>
			</section>

			<section className="mx-auto w-full max-w-7xl px-8 py-10">
				{places.length === 0 ? (
					<p className="text-neutral-500">
						{query ? `No places found for "${query}".` : 'No places yet.'}
					</p>
				) : (
					<ul className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
						{places.map((place) => (
							<PlaceCard
								key={place.id}
								name={place.name}
								shortDescription={place.shortDescription}
								categoryName={place.category?.name ?? null}
								imageUrl={place.images[0]?.url ?? null}
							/>
						))}
					</ul>
				)}
			</section>
		</div>
	)
}

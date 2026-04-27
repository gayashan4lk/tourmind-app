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
			<section className="bg-[#d9d9d9]">
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
								basePath={`/places/${place.id}`}
							/>
						))}
					</ul>
				)}
			</section>
		</div>
	)
}

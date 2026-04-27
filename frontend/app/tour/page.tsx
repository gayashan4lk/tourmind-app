import { getTouristCategories, getTouristPlaces } from "@/actions/place";
import { PlaceCard } from "@/app/tour/_components/place-card";
import { PlaceSearchForm } from "@/app/tour/_components/place-search-form";

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function TourPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = firstParam(params.q);
  const categoryId = firstParam(params.categoryId);

  const [places, categories] = await Promise.all([
    getTouristPlaces({
      q: q || undefined,
      categoryId: categoryId || undefined,
    }),
    getTouristCategories(),
  ]);

  return (
    <section className="mx-auto w-full max-w-7xl px-8 py-10">
      <PlaceSearchForm q={q} categoryId={categoryId} categories={categories} />

      {places.length === 0 ? (
        <p className="mt-16 text-center text-neutral-500">
          {q ? `No places found for "${q}".` : "No places yet."}
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
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
  );
}

import { getTouristCategories, getTouristPlaces } from "@/actions/place";
import { CreateTourForm } from "@/app/tour/create/_components/create-tour-form";

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function CreateTourPage({
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

  const placeProps = places.map((place) => ({
    id: place.id,
    name: place.name,
    shortDescription: place.shortDescription,
    imageUrl: place.images[0]?.url ?? null,
    categoryName: place.category?.name ?? null,
  }));

  return (
    <section className="mx-auto w-full max-w-7xl px-8 py-10">
      <h1 className="mb-6 text-3xl font-bold">Create tour</h1>
      <CreateTourForm
        q={q}
        categoryId={categoryId}
        categories={categories}
        places={placeProps}
      />
    </section>
  );
}

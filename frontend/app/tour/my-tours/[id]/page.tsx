import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMyTour } from "@/actions/tour";
import { Button } from "@/components/ui/button";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tour = await getMyTour(id);

  if (!tour) notFound();

  const placeCount = tour.items.length;

  return (
    <section className="mx-auto w-full max-w-5xl px-8 py-10">
      <div className="mb-2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="rounded-full px-3 text-neutral-500"
        >
          <Link href="/tour/my-tours">← Back to my tours</Link>
        </Button>
      </div>

      <header className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{tour.title}</h1>
        {tour.description ? (
          <p className="whitespace-pre-wrap text-neutral-600">
            {tour.description}
          </p>
        ) : null}
        <p className="text-sm text-neutral-500">
          {placeCount} {placeCount === 1 ? "place" : "places"} · created{" "}
          {dateFormatter.format(tour.createdAt)}
        </p>
      </header>

      {placeCount === 0 ? (
        <p className="text-center text-neutral-500">This tour has no places.</p>
      ) : (
        <ol className="flex flex-col gap-8">
          {tour.items.map((item, index) => {
            const place = item.place;
            const imageUrl = place.images[0]?.url ?? null;
            return (
              <li
                key={item.id}
                className="grid grid-cols-1 gap-6 rounded-2xl bg-neutral-100 p-6 sm:grid-cols-[220px_1fr]"
              >
                <div className="flex flex-col gap-3">
                  <div className="relative aspect-220/180 w-full overflow-hidden rounded-2xl bg-neutral-200">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={place.name}
                        fill
                        sizes="(min-width: 640px) 220px, 100vw"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <span className="text-sm font-medium text-neutral-500">
                    Stop {index + 1}
                  </span>
                </div>

                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="text-xl font-semibold">{place.name}</h2>
                    {!place.isActive ? (
                      <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs text-neutral-600">
                        No longer available
                      </span>
                    ) : null}
                  </div>
                  {place.category?.name ? (
                    <p className="text-neutral-500">{place.category.name}</p>
                  ) : null}

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
                  {place.travelTips ? (
                    <div>
                      <p className="font-medium">Travel tips</p>
                      <p className="whitespace-pre-wrap text-neutral-600">
                        {place.travelTips}
                      </p>
                    </div>
                  ) : null}
                  {place.dressCode ? (
                    <div>
                      <p className="font-medium">Dress code</p>
                      <p className="whitespace-pre-wrap text-neutral-600">
                        {place.dressCode}
                      </p>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

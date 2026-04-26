import Image from "next/image";
import Link from "next/link";
import { getTouristPlaces } from "@/actions/place";
import { Button } from "@/components/ui/button";
import HomeSearchBar from "./_components/home-search-bar";

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || undefined;
  const places = await getTouristPlaces({ q: query });

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

        <HomeSearchBar defaultQuery={query} />
      </section>

      <section className="mx-auto w-full max-w-7xl px-8 py-10">
        {places.length === 0 ? (
          <p className="text-neutral-500">
            {query ? `No places found for "${query}".` : "No places yet."}
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {places.map((place) => {
              const image = place.images[0];
              return (
                <li key={place.id} className="flex flex-col gap-3">
                  <Link
                    href={`/places/${place.id}`}
                    className="flex flex-col gap-3"
                  >
                    <div className="relative aspect-220/180 w-full overflow-hidden rounded-2xl bg-neutral-200">
                      {image && (
                        <Image
                          src={image.url}
                          alt={place.name}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="text-sm leading-tight">
                      <p className="text-foreground font-medium">
                        {place.name}
                      </p>
                      <p className="text-neutral-400">
                        {place.shortDescription}
                      </p>
                      {place.category?.name && (
                        <p className="text-neutral-400">
                          {place.category.name}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

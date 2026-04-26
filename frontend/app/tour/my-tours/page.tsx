import Link from "next/link";
import { getMyTours } from "@/actions/tour";
import { Button } from "@/components/ui/button";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export default async function MyToursPage() {
  const tours = await getMyTours();

  return (
    <section className="mx-auto w-full max-w-7xl px-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My tours</h1>
        <Button
          asChild
          className="bg-brand-red hover:bg-brand-red/80 h-10 rounded-full px-6 text-base font-semibold text-white"
        >
          <Link href="/tour/create">Create tour</Link>
        </Button>
      </div>

      {tours.length === 0 ? (
        <p className="mt-16 text-center text-neutral-500">
          You haven&apos;t created any tours yet.{" "}
          <Link href="/tour/create" className="text-brand-red underline">
            Create your first one
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <li key={tour.id}>
              <Link
                href={`/tour/my-tours/${tour.id}`}
                className="flex h-full flex-col gap-2 rounded-2xl bg-neutral-100 p-6 transition-colors hover:bg-neutral-200"
              >
                <h2 className="text-lg font-semibold">{tour.title}</h2>
                {tour.description ? (
                  <p className="line-clamp-3 text-sm text-neutral-600">
                    {tour.description}
                  </p>
                ) : null}
                <div className="mt-auto flex items-center justify-between pt-4 text-xs text-neutral-500">
                  <span>
                    {tour._count.items}{" "}
                    {tour._count.items === 1 ? "place" : "places"}
                  </span>
                  <span>{dateFormatter.format(tour.createdAt)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

import type { ReactNode } from "react";
import Image from "next/image";

type PlaceCardProps = {
  name: string;
  shortDescription: string;
  categoryName?: string | null;
  imageUrl?: string | null;
  action?: ReactNode;
};

export function PlaceCard({
  name,
  shortDescription,
  categoryName,
  imageUrl,
  action,
}: PlaceCardProps) {
  return (
    <li className="flex flex-col gap-3">
      <div className="relative aspect-220/180 w-full overflow-hidden rounded-2xl bg-neutral-200">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="text-sm leading-tight">
        <p className="text-foreground font-medium">{name}</p>
        <p className="text-neutral-400">{shortDescription}</p>
        {categoryName ? (
          <p className="text-neutral-400">{categoryName}</p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </li>
  );
}

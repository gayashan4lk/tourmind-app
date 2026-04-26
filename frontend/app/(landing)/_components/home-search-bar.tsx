"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function HomeSearchBar({
  defaultQuery,
}: {
  defaultQuery?: string;
}) {
  return (
    <form
      action="/"
      method="get"
      className="mx-auto mt-16 flex w-full max-w-196 items-center rounded-full bg-white px-2 shadow-sm"
    >
      <input
        type="search"
        name="q"
        defaultValue={defaultQuery ?? ""}
        placeholder="Search places in Matara"
        className="h-14 flex-1 rounded-full bg-transparent px-6 text-lg placeholder:text-[#b3b3b3] focus:outline-none"
      />
      <Separator orientation="vertical" className="bg-border my-2 border" />
      <input
        type="search"
        disabled
        placeholder="Category"
        className="h-14 w-44 bg-transparent px-6 text-lg placeholder:text-[#b3b3b3] focus:outline-none"
      />
      <Separator orientation="vertical" className="bg-border my-2 border" />
      <input
        type="search"
        disabled
        placeholder="Tag"
        className="h-14 w-44 bg-transparent px-6 text-lg placeholder:text-[#b3b3b3] focus:outline-none"
      />
      <Button
        type="submit"
        size="icon"
        aria-label="Search"
        className="bg-brand-red hover:bg-brand-red/80 size-11 rounded-full text-white"
      >
        <Search className="size-5" />
      </Button>
    </form>
  );
}

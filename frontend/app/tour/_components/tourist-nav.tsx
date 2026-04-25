"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Places", href: "/tour" },
  { label: "My tours", href: "/tour/my-tours" },
];

export function TouristNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-10">
      {navItems.map((item) => {
        const active =
          item.href === "/tour"
            ? pathname === "/tour"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? "hover:text-brand-red hover:decoration-brand-red text-base font-semibold text-neutral-700 underline decoration-neutral-700 decoration-3 underline-offset-4 hover:underline hover:decoration-3 hover:underline-offset-4"
                : "hover:text-brand-red hover:decoration-brand-red text-base font-semibold text-neutral-700 hover:underline hover:decoration-3 hover:underline-offset-4"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

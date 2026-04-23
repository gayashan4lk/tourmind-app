'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
	{ label: 'Places', href: '/host' },
	{ label: 'Categories', href: '/host/categories' },
	{ label: 'Tags', href: '/host/tags' },
]

export function HostNav() {
	const pathname = usePathname()

	return (
		<nav className="flex items-center gap-10">
			{navItems.map((item) => {
				const active =
					item.href === '/host'
						? pathname === '/host'
						: pathname === item.href || pathname.startsWith(`${item.href}/`)

				return (
					<Link
						key={item.href}
						href={item.href}
						className={
							active
								? 'text-brand-red decoration-brand-red text-base font-semibold underline decoration-3 underline-offset-4'
								: 'hover:text-brand-red hover:decoration-brand-red text-base font-semibold text-neutral-700 hover:underline hover:decoration-3 hover:underline-offset-4'
						}
					>
						{item.label}
					</Link>
				)
			})}
		</nav>
	)
}

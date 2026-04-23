import Link from 'next/link'

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div>
			<header>
				<div className="mx-auto w-full max-w-7xl bg-gray-100 px-8 py-4">
					<Link
						href="/"
						className="text-brand-red text-3xl font-black tracking-tight"
					>
						TourMind
					</Link>
				</div>
			</header>
			<main className="flex-1">{children}</main>
		</div>
	)
}

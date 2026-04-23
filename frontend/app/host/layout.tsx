import Link from 'next/link'
import { HostNav } from './_components/host-nav'

export default function HostLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="flex flex-col">
			<header className="bg-[#d9d9d9]">
				<div className="mx-auto flex h-25 w-full max-w-7xl items-center justify-between px-8">
					<div className="flex items-center gap-14">
						<Link
							href="/host"
							className="text-brand-red text-3xl font-black tracking-tight"
						>
							TourMind
						</Link>
						<HostNav />
					</div>
					<div
						className="bg-brand-red size-12 rounded-full"
						aria-label="User avatar"
					/>
				</div>
			</header>
			{children}
		</div>
	)
}

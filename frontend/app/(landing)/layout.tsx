import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function LandingLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<main className="flex-1">
			<section className="relative bg-[#d9d9d9] py-8">
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
			</section>
			{children}
		</main>
	)
}

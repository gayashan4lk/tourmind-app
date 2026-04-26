import { headers } from 'next/headers'
import Link from 'next/link'
import { forbidden } from 'next/navigation'
import UserAvatar from '@/app/host/_components/user-avatar'
import { TouristNav } from '@/app/tour/_components/tourist-nav'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'

export default async function TourLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = await auth.api.getSession({ headers: await headers() })

	if (!session || session.user.role !== 'tourist') {
		forbidden()
	}

	const { user } = session

	return (
		<div className="flex flex-col">
			<header className="bg-[#d9d9d9]">
				<div className="mx-auto flex h-25 w-full max-w-7xl items-center justify-between px-8">
					<div className="flex items-center gap-14">
						<Link
							href="/tour"
							className="text-brand-red text-3xl font-black tracking-tight"
						>
							TourMind
						</Link>
						<TouristNav />
					</div>
					<div className="flex items-center gap-4">
						<UserAvatar user={user} />
					</div>
				</div>
			</header>
			{children}
		</div>
	)
}

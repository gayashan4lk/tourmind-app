import Link from 'next/link'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { forbidden, redirect } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/actions/auth'
import { HostNav } from '@/app/host/_components/host-nav'
import UserAvatar from '@/app/host/_components/user-avatar'

export default async function TourLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = await auth.api.getSession({ headers: await headers() })

	if (!session || session.user.role !== 'tourist') {
		forbidden()
	}

	const { user, session: userSession } = session

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
					<UserAvatar user={user} />
				</div>
			</header>
			{children}
		</div>
	)
}

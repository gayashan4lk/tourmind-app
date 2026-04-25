'use client'

import { signOut } from '@/actions/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type UserAvatarProps = {
	user: {
		name: string
		email: string
		image?: string | null
	}
}

export default function UserAvatar({ user }: UserAvatarProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="flex cursor-pointer flex-row items-center gap-3 rounded-lg px-4 py-2 hover:bg-neutral-300">
					<Avatar className="size-12">
						<AvatarImage src={user.image || ''} alt={user.name} />
						<AvatarFallback>
							{user.name?.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-72 min-w-56 rounded-lg"
				side="top"
				align="end"
				sideOffset={4}
			>
				<div className="flex flex-row items-center gap-3 rounded-lg px-4 py-2">
					<Avatar className="size-12">
						<AvatarImage src={user.image || ''} alt={user.name} />
						<AvatarFallback>
							{user.name?.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col text-left text-sm leading-tight">
						<span className="truncate font-medium">{user.name}</span>
						<span className="truncate text-xs">{user.email}</span>
					</div>
				</div>

				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Settings</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem variant="destructive" onClick={signOut}>
						Logout
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

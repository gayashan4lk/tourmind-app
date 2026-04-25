import { signOut } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session || !session.user) {
		return (
			<div>
				<p>Not authorized.</p>
				<Link href="/signin" className="text-blue-500 hover:underline">
					Login
				</Link>
				<Link href="/signup" className="text-blue-500 hover:underline">
					Sign Up
				</Link>
			</div>
		)
	}

	if (session.user.role === 'host') {
		redirect('/host/places')
	} else if (session.user.role === 'tourist') {
		redirect('/tour')
	} else {
		return (
			<div>
				<p>Welcome, {session.user.name || session.user.email || 'User'}!</p>
				<p>Your role is {session.user.role}</p>
				<p>Welcome to the dashboard!</p>
				<Button onClick={signOut}>Logout</Button>
			</div>
		)
	}
}

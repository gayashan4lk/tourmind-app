import { signOut } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'

export default async function Dashboard() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session) {
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

	// User role is not host. Render tourist dashboard
	if (session.user.role != 'host') {
		return (
			<div>
				<h1 className="text-6xl font-bold">Tourist Dashboard</h1>
				<p>Welcome, {session.user.name || session.user.email || 'User'}!</p>
				<p>Your role is {session.user.role}</p>
				<p>Welcome to the dashboard!</p>
				<Button onClick={signOut}>Logout</Button>
			</div>
		)
	}

	// User role is host. Render host dashboard
	return (
		<div>
			<h1 className="text-6xl font-bold">Host Dashboard</h1>
			<p>Welcome, {session.user.name || session.user.email || 'User'}!</p>
			<p>Your role is {session.user.role}</p>
			<p>Welcome to the dashboard!</p>
			<Button onClick={signOut}>Logout</Button>
		</div>
	)
}

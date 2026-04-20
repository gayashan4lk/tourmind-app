import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'

export default async function Home() {
	const res = await fetch(`${process.env.API_BASE_URL}/`)
	const data = await res.json()

	if (!data) {
		return <div>API call failed</div>
	}

	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session) {
		return (
			<div>
				<SystemHealthCheck data={data} />
				<Link href="/signin" className="text-blue-500 hover:underline">
					Login
				</Link>
				<Link href="/signup" className="text-blue-500 hover:underline">
					Sign Up
				</Link>
			</div>
		)
	}

	return <SystemHealthCheck data={data} />
}

function SystemHealthCheck(data: any) {
	return (
		<div>
			<Link href="/" className="text-blue-500 hover:underline">
				<h1 className="text-6xl font-bold">TourMind</h1>
			</Link>
			<h1 className="text-2xl font-bold">System healthcheck</h1>
			<p>Status: {data.status}</p>
			<p>Service: {data.service}</p>
		</div>
	)
}

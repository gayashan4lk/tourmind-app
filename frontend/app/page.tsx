import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export default async function Home() {
	const res = await fetch(`${process.env.API_BASE_URL}/`)
	const data = await res.json()

	if (!data) {
		return <div>API call failed</div>
	}

	const session = await auth.api.getSession({
		headers: await headers(),
	})

	return (
		<div>
			<h1 className="text-6xl font-bold">TourMind</h1>
			<h1 className="text-2xl font-bold">System healthcheck</h1>
			<p>Status: {data.status}</p>
			<p>Service: {data.service}</p>
		</div>
	)
}

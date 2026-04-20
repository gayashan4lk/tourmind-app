import Link from 'next/link'

export default function SignInPage() {
	return (
		<div>
			<Link href="/" className="text-blue-500 hover:underline">
				<h1 className="text-6xl font-bold">TourMind</h1>
			</Link>
			<h1 className="text-2xl font-bold">Sign In</h1>
			<p>Sign in functionality will be implemented here.</p>
		</div>
	)
}

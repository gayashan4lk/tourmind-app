import { signOut } from '@/actions/auth'
import { Button } from '@/components/ui/button'

export default function TourPage() {
	return (
		<div>
			<h1 className="text-6xl font-bold">Tour Page</h1>
			<p>Welcome to the tour page!</p>
			<Button onClick={signOut}>Logout</Button>
		</div>
	)
}

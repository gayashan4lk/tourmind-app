import { signOut } from '@/actions/auth'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
	return (
		<div>
			<h1 className="text-6xl font-bold">Dashboard</h1>
			<p>Welcome to the dashboard!</p>
			<Button onClick={signOut}>Logout</Button>
		</div>
	)
}

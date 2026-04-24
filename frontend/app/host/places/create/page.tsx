import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import CreatePlaceForm from './create-place-form'

export default async function CreatePlacePage() {
	const session = await auth.api.getSession({ headers: await headers() })

	if (!session || session.user.role !== 'host') {
		redirect('/signin')
	}

	const categories = await prisma.category.findMany({
		where: { userId: session.user.id },
		orderBy: { name: 'asc' },
		select: { id: true, name: true },
	})

	return (
		<section className="mx-auto w-full max-w-xl px-8 py-10">
			<div className="mb-8">
				<h1 className="text-2xl font-semibold tracking-tight">Create Place</h1>
				<p className="text-sm text-neutral-500">
					Add a new place for travelers to discover.
				</p>
			</div>

			<CreatePlaceForm categories={categories} />
		</section>
	)
}

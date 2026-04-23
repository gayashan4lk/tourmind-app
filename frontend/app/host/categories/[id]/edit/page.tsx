import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { EditCategoryForm } from './edit-form'

export default async function EditCategoryPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	const session = await auth.api.getSession({ headers: await headers() })

	if (!session || session.user.role !== 'host') {
		redirect('/signin')
	}

	const category = await prisma.category.findUnique({
		where: { id },
		select: { id: true, name: true, userId: true },
	})

	if (!category || category.userId !== session.user.id) {
		notFound()
	}

	return (
		<section className="mx-auto w-full max-w-xl px-8 py-10">
			<div className="mb-8">
				<h1 className="text-2xl font-semibold tracking-tight">Edit Category</h1>
				<p className="text-sm text-neutral-500">
					Rename your category. Places under it stay linked.
				</p>
			</div>

			<EditCategoryForm id={category.id} name={category.name} />
		</section>
	)
}

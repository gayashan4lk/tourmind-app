import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { getCategoryVisual } from '@/lib/category-visual'
import prisma from '@/lib/prisma'
import { Pencil, Plus } from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function HostCategoriesPage() {
	const session = await auth.api.getSession({ headers: await headers() })

	if (!session || session.user.role !== 'host') {
		redirect('/signin')
	}

	const categories = await prisma.category.findMany({
		where: { userId: session.user.id },
		orderBy: { createdAt: 'desc' },
		include: { _count: { select: { places: true } } },
	})

	return (
		<>
			<section className="mx-auto w-full max-w-7xl px-8 pt-8">
				<div className="flex justify-end">
					<Button
						asChild
						className="bg-brand-red hover:bg-brand-red/80 h-9 rounded-full px-6 text-base font-semibold text-white"
					>
						<Link href="/host/categories/create">
							<Plus />
							Create Category
						</Link>
					</Button>
				</div>
			</section>

			<section className="mx-auto w-full max-w-7xl px-8 py-10">
				{categories.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
						<p className="text-foreground text-lg font-medium">
							No categories yet
						</p>
						<p className="text-sm text-neutral-500">
							Create your first category to group your places.
						</p>
					</div>
				) : (
					<ul className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
						{categories.map((category) => {
							const { Icon, bgClass, fgClass } = getCategoryVisual(
								category.name,
							)
							return (
								<li key={category.id}>
									<Link
										href={`/host/categories/${category.id}/edit`}
										className="-mx-2 flex items-center gap-4 rounded-xl px-2 py-2 transition-colors hover:bg-neutral-100"
									>
										<div
											className={`flex size-16 shrink-0 items-center justify-center rounded-xl ${bgClass}`}
										>
											<Icon className={`size-8 ${fgClass}`} strokeWidth={1.5} />
										</div>
										<div className="leading-tight">
											<p className="text-foreground text-lg font-semibold">
												{category.name}
											</p>
											<p className="text-sm text-neutral-400">
												{category._count.places}{' '}
												{category._count.places === 1 ? 'place' : 'places'}
											</p>
										</div>
									</Link>
								</li>
							)
						})}
					</ul>
				)}
			</section>
		</>
	)
}

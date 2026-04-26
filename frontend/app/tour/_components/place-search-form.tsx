'use client'

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { CircleChevronDown } from 'lucide-react'

const ALL_CATEGORIES = '__all__'

type Category = { id: string; name: string }

type PlaceSearchFormProps = {
	q: string
	categoryId: string
	categories: Category[]
}

export function PlaceSearchForm({
	q,
	categoryId,
	categories,
}: PlaceSearchFormProps) {
	const router = useRouter()
	const [query, setQuery] = useState(q)
	const [category, setCategory] = useState(categoryId || ALL_CATEGORIES)

	function pushParams(nextQuery: string, nextCategory: string) {
		const params = new URLSearchParams()
		if (nextQuery) params.set('q', nextQuery)
		if (nextCategory && nextCategory !== ALL_CATEGORIES) {
			params.set('categoryId', nextCategory)
		}
		const qs = params.toString()
		router.push(qs ? `/tour?${qs}` : '/tour')
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
			<form
				onSubmit={(event) => {
					event.preventDefault()
					pushParams(query, category)
				}}
				className="flex h-12 items-center rounded-full bg-neutral-200 pr-1 pl-6"
			>
				<input
					type="search"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder="Search places in Matara"
					className="h-full flex-1 bg-transparent text-base font-semibold placeholder:text-neutral-700 focus:outline-none"
				/>
				<Button
					type="submit"
					size="icon"
					aria-label="Search"
					className="bg-brand-red hover:bg-brand-red/80 size-10 rounded-full text-white"
				>
					<Search className="size-5" />
				</Button>
			</form>

			<Select
				value={category}
				onValueChange={(next) => {
					setCategory(next)
					pushParams(query, next)
				}}
			>
				<SelectTrigger className="h-12! w-full rounded-full border-0 bg-neutral-200 px-6 text-base font-semibold text-neutral-700">
					<SelectValue placeholder="Filter by category" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL_CATEGORIES}>All categories</SelectItem>
					{categories.map((c) => (
						<SelectItem key={c.id} value={c.id}>
							{c.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<div
				aria-disabled="true"
				className="flex h-12 w-full items-center rounded-full bg-neutral-200 px-6 text-base font-semibold text-neutral-700"
			>
				<span className="flex-1">Filter by tag</span>
			</div>
		</div>
	)
}

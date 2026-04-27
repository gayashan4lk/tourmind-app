'use client'

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

const ALL_CATEGORIES = '__all__'

type Category = { id: string; name: string }

export default function HomeSearchBar({
	defaultQuery,
	categoryId,
	categories,
}: {
	defaultQuery?: string
	categoryId?: string
	categories: Category[]
}) {
	const router = useRouter()
	const [query, setQuery] = useState(defaultQuery ?? '')
	const [category, setCategory] = useState(categoryId || ALL_CATEGORIES)
	const noCategories = categories.length === 0

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const params = new URLSearchParams()
		if (query.trim()) params.set('q', query.trim())
		if (category && category !== ALL_CATEGORIES) {
			params.set('categoryId', category)
		}
		const qs = params.toString()
		router.push(qs ? `/?${qs}` : '/')
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="mx-auto mt-16 flex w-full max-w-196 items-center rounded-full bg-white px-2 shadow-sm"
		>
			<input
				type="search"
				name="q"
				value={query}
				onChange={(event) => setQuery(event.target.value)}
				placeholder="Search places in Matara"
				className="h-14 flex-1 rounded-full bg-transparent px-6 text-lg placeholder:text-[#b3b3b3] focus:outline-none"
			/>
			<Separator orientation="vertical" className="bg-border my-2 border" />
			<Select
				value={category}
				onValueChange={setCategory}
				disabled={noCategories}
			>
				<SelectTrigger className="h-14! w-60 rounded-full border-0 bg-transparent px-6 text-lg text-neutral-700 shadow-none focus-visible:ring-0 data-[placeholder]:text-[#b3b3b3]">
					<SelectValue placeholder="Category" />
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
			{/* <Separator orientation="vertical" className="bg-border my-2 border" />
      <input
        type="search"
        disabled
        placeholder="Tag"
        className="h-14 w-44 bg-transparent px-6 text-lg placeholder:text-[#b3b3b3] focus:outline-none"
      /> */}
			<Button
				type="submit"
				size="icon"
				aria-label="Search"
				className="bg-brand-red hover:bg-brand-red/80 size-11 rounded-full text-white"
			>
				<Search className="size-5" />
			</Button>
		</form>
	)
}

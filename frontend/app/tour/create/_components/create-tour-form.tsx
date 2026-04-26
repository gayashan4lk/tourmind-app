'use client'

import { ArrowDown, ArrowUp, Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState, useTransition } from 'react'
import { createTour } from '@/actions/tour'
import { PlaceCard } from '@/app/tour/_components/place-card'
import { PlaceSearchForm } from '@/app/tour/_components/place-search-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { CreateTourActionResponse } from '@/types/tour'

type Place = {
	id: string
	name: string
	shortDescription: string
	imageUrl: string | null
	categoryName: string | null
}

type Selected = {
	key: string
	id: string
	name: string
}

type CreateTourFormProps = {
	q: string
	categoryId: string
	categories: { id: string; name: string }[]
	places: Place[]
}

const initialState: CreateTourActionResponse = { success: false, message: '' }

export function CreateTourForm({
	q,
	categoryId,
	categories,
	places,
}: CreateTourFormProps) {
	const router = useRouter()
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [selected, setSelected] = useState<Selected[]>([])
	const [, startTransition] = useTransition()
	const [state, formAction, isPending] = useActionState(
		createTour,
		initialState,
	)

	useEffect(() => {
		if (state.success && state.tourId) {
			router.push('/tour/my-tours')
		}
	}, [state, router])

	function addPlace(place: Place) {
		setSelected((prev) => [
			...prev,
			{
				key: `${place.id}-${Date.now()}-${Math.random()}`,
				id: place.id,
				name: place.name,
			},
		])
	}

	function removeAt(index: number) {
		setSelected((prev) => prev.filter((_, i) => i !== index))
	}

	function move(index: number, direction: -1 | 1) {
		setSelected((prev) => {
			const next = [...prev]
			const target = index + direction
			if (target < 0 || target >= next.length) return prev
			;[next[index], next[target]] = [next[target], next[index]]
			return next
		})
	}

	const canSubmit = title.trim().length > 0 && selected.length > 0 && !isPending

	const fieldErrors = state.error?.fieldErrors

	return (
		<div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
			<div>
				<PlaceSearchForm
					q={q}
					categoryId={categoryId}
					categories={categories}
					basePath="/tour/create"
				/>
				{places.length === 0 ? (
					<p className="mt-16 text-center text-neutral-500">No places found.</p>
				) : (
					<ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
						{places.map((place) => (
							<PlaceCard
								key={place.id}
								name={place.name}
								shortDescription={place.shortDescription}
								categoryName={place.categoryName}
								imageUrl={place.imageUrl}
								action={
									<Button
										type="button"
										size="sm"
										onClick={() => addPlace(place)}
										className="bg-brand-red hover:bg-brand-red/80 rounded-full text-white"
									>
										<Plus className="size-4" /> Add to tour
									</Button>
								}
							/>
						))}
					</ul>
				)}
			</div>

			<form
				action={(formData) => {
					formData.set('placeIds', JSON.stringify(selected.map((s) => s.id)))
					startTransition(() => formAction(formData))
				}}
				className="sticky top-6 flex h-fit flex-col gap-4 rounded-2xl bg-neutral-100 p-6"
			>
				<h2 className="text-xl font-bold">Your tour</h2>

				<div className="flex flex-col gap-2">
					<Label htmlFor="title">Title</Label>
					<Input
						id="title"
						name="title"
						value={title}
						onChange={(event) => setTitle(event.target.value)}
						placeholder="Day in Matara"
						maxLength={120}
						required
						aria-invalid={fieldErrors?.title ? true : undefined}
						className="bg-white"
					/>
					{fieldErrors?.title?.[0] ? (
						<p className="text-destructive text-xs">{fieldErrors.title[0]}</p>
					) : null}
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="description">Description (optional)</Label>
					<Textarea
						id="description"
						name="description"
						value={description}
						onChange={(event) => setDescription(event.target.value)}
						placeholder="What is this tour about?"
						maxLength={2000}
						rows={3}
						className="bg-white"
					/>
					{fieldErrors?.description?.[0] ? (
						<p className="text-destructive text-xs">
							{fieldErrors.description[0]}
						</p>
					) : null}
				</div>

				<div className="flex flex-col gap-2">
					<div className="flex items-baseline justify-between">
						<Label>Places</Label>
						<span className="text-xs text-neutral-500">
							{selected.length} added
						</span>
					</div>
					{selected.length === 0 ? (
						<p className="rounded-md bg-white px-3 py-4 text-sm text-neutral-500">
							Pick places from the list and they will appear here.
						</p>
					) : (
						<ol className="flex flex-col gap-2">
							{selected.map((item, index) => (
								<li
									key={item.key}
									className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm"
								>
									<span className="w-5 shrink-0 text-neutral-400">
										{index + 1}.
									</span>
									<span className="flex-1 truncate">{item.name}</span>
									<Button
										type="button"
										size="icon-xs"
										variant="ghost"
										onClick={() => move(index, -1)}
										disabled={index === 0}
										aria-label="Move up"
									>
										<ArrowUp />
									</Button>
									<Button
										type="button"
										size="icon-xs"
										variant="ghost"
										onClick={() => move(index, 1)}
										disabled={index === selected.length - 1}
										aria-label="Move down"
									>
										<ArrowDown />
									</Button>
									<Button
										type="button"
										size="icon-xs"
										variant="ghost"
										onClick={() => removeAt(index)}
										aria-label="Remove"
									>
										<X />
									</Button>
								</li>
							))}
						</ol>
					)}
					{fieldErrors?.placeIds?.[0] ? (
						<p className="text-destructive text-xs">
							{fieldErrors.placeIds[0]}
						</p>
					) : null}
				</div>

				{state.message && !state.success ? (
					<p className="text-destructive text-sm">{state.message}</p>
				) : null}

				<Button
					type="submit"
					disabled={!canSubmit}
					className="bg-brand-red hover:bg-brand-red/80 h-11 rounded-full text-white"
				>
					{isPending ? 'Creating…' : 'Create tour'}
				</Button>
			</form>
		</div>
	)
}

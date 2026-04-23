'use client'

import { createPlace } from '@/actions/place'
import { Button } from '@/components/ui/button'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CreatePlaceActionResponse } from '@/types/place'
import Link from 'next/link'
import { useActionState } from 'react'

const initialState: CreatePlaceActionResponse = {
	success: false,
	message: '',
}

type CategoryOption = { id: string; name: string }

export default function CreatePlaceForm({
	categories,
}: {
	categories: CategoryOption[]
}) {
	const [state, action, isPending] = useActionState(createPlace, initialState)

	return (
		<form action={action}>
			<FieldSet>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="name">Name</FieldLabel>
						<Input
							id="name"
							name="name"
							type="text"
							placeholder="e.g. Galle Fort"
							autoFocus
							required
						/>
						{state.error?.fieldErrors.name?.map((error) => (
							<FieldError key={error}>{error}</FieldError>
						))}
					</Field>

					<Field>
						<FieldLabel htmlFor="shortDescription">
							Short description
						</FieldLabel>
						<Textarea
							id="shortDescription"
							name="shortDescription"
							placeholder="A one-liner shown in listings"
							rows={2}
							required
						/>
						{state.error?.fieldErrors.shortDescription?.map((error) => (
							<FieldError key={error}>{error}</FieldError>
						))}
					</Field>

					<Field>
						<FieldLabel htmlFor="fullDescription">Full description</FieldLabel>
						<Textarea
							id="fullDescription"
							name="fullDescription"
							placeholder="Tell travelers about this place"
							rows={6}
							required
						/>
						{state.error?.fieldErrors.fullDescription?.map((error) => (
							<FieldError key={error}>{error}</FieldError>
						))}
					</Field>

					<Field>
						<FieldLabel htmlFor="openingHours">Opening hours</FieldLabel>
						<Input
							id="openingHours"
							name="openingHours"
							type="text"
							placeholder="e.g. Mon–Sun, 9am–6pm"
							required
						/>
						{state.error?.fieldErrors.openingHours?.map((error) => (
							<FieldError key={error}>{error}</FieldError>
						))}
					</Field>

					<Field>
						<FieldLabel htmlFor="entryFee">Entry fee</FieldLabel>
						<Input
							id="entryFee"
							name="entryFee"
							type="text"
							placeholder="e.g. Free, LKR 500, USD 10"
							required
						/>
						{state.error?.fieldErrors.entryFee?.map((error) => (
							<FieldError key={error}>{error}</FieldError>
						))}
					</Field>

					<Field>
						<FieldLabel htmlFor="categoryId">Category</FieldLabel>
						<Select name="categoryId">
							<SelectTrigger id="categoryId" className="w-full">
								<SelectValue
									placeholder={
										categories.length === 0
											? 'No categories yet'
											: 'Select a category (optional)'
									}
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{categories.map((category) => (
										<SelectItem key={category.id} value={category.id}>
											{category.name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
						{state.error?.fieldErrors.categoryId?.map((error) => (
							<FieldError key={error}>{error}</FieldError>
						))}
					</Field>

					<Field>
						<FieldLabel htmlFor="travelTips">Travel tips</FieldLabel>
						<Textarea
							id="travelTips"
							name="travelTips"
							placeholder="Optional: what to bring, best time to visit..."
							rows={4}
						/>
						{state.error?.fieldErrors.travelTips?.map((error) => (
							<FieldError key={error}>{error}</FieldError>
						))}
					</Field>

					<Field>
						<FieldLabel htmlFor="dressCode">Dress code</FieldLabel>
						<Textarea
							id="dressCode"
							name="dressCode"
							placeholder="Optional: any dress code requirements"
							rows={2}
						/>
						{state.error?.fieldErrors.dressCode?.map((error) => (
							<FieldError key={error}>{error}</FieldError>
						))}
					</Field>

					{state.message && !state.success && (
						<p className="text-sm text-red-500">{state.message}</p>
					)}

					<Field>
						<div className="flex items-center gap-3">
							<Button
								type="submit"
								disabled={isPending}
								className="bg-brand-red hover:bg-brand-red/80 h-9 rounded-full px-6 text-base font-semibold text-white"
							>
								{isPending ? 'Creating...' : 'Create'}
							</Button>
							<Button
								asChild
								variant="outline"
								className="h-9 rounded-full px-6 text-base font-semibold"
							>
								<Link href="/host/places">Cancel</Link>
							</Button>
						</div>
					</Field>
				</FieldGroup>
			</FieldSet>
		</form>
	)
}

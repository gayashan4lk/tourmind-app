'use client'

import { createCategory } from '@/actions/category'
import { Button } from '@/components/ui/button'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { CreateCategoryActionResponse } from '@/types/category'
import Link from 'next/link'
import { useActionState } from 'react'

const initialState: CreateCategoryActionResponse = {
	success: false,
	message: '',
}

export default function CreateCategoryPage() {
	const [state, action, isPending] = useActionState(
		createCategory,
		initialState,
	)

	return (
		<section className="mx-auto w-full max-w-xl px-8 py-10">
			<div className="mb-8">
				<h1 className="text-2xl font-semibold tracking-tight">
					Create Category
				</h1>
				<p className="text-sm text-neutral-500">
					Group your places under a category so travelers can discover them.
				</p>
			</div>

			<form action={action}>
				<FieldSet>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="name">Name</FieldLabel>
							<Input
								id="name"
								name="name"
								type="text"
								placeholder="e.g. Beachfront"
								autoFocus
								required
							/>
							{state.error?.fieldErrors.name?.map((error) => (
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
									<Link href="/host/categories">Cancel</Link>
								</Button>
							</div>
						</Field>
					</FieldGroup>
				</FieldSet>
			</form>
		</section>
	)
}

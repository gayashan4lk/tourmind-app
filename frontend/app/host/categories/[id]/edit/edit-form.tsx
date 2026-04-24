'use client'

import { updateCategory } from '@/actions/category'
import { Button } from '@/components/ui/button'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { UpdateCategoryActionResponse } from '@/types/category'
import Link from 'next/link'
import { useActionState } from 'react'

const initialState: UpdateCategoryActionResponse = {
	success: false,
	message: '',
}

export function EditCategoryForm({ id, name }: { id: string; name: string }) {
	const [state, action, isPending] = useActionState(
		updateCategory,
		initialState,
	)

	return (
		<form action={action}>
			<input type="hidden" name="id" value={id} />
			<FieldSet>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="name">Name</FieldLabel>
						<Input
							id="name"
							name="name"
							type="text"
							defaultValue={name}
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
								{isPending ? 'Saving...' : 'Save'}
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
	)
}

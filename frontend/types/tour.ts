import { z } from 'zod'

export const CreateTourSchema = z.object({
	title: z
		.string()
		.trim()
		.min(1, 'Title is required')
		.max(120, 'Title must be at most 120 characters'),
	description: z
		.string()
		.trim()
		.max(2000, 'Description must be at most 2000 characters')
		.optional()
		.or(z.literal('').transform(() => undefined)),
	placeIds: z
		.array(z.string().min(1))
		.min(1, 'Add at least one place')
		.max(50, 'A tour can include at most 50 places'),
})

export type CreateTourInput = z.infer<typeof CreateTourSchema>

export type CreateTourActionResponse = {
	success: boolean
	message: string
	tourId?: string
	error?: {
		formErrors: string[]
		fieldErrors: {
			[K in keyof CreateTourInput]?: string[]
		}
	}
}

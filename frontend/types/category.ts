import { z } from 'zod'

export const CreateCategorySchema = z.object({
	name: z
		.string()
		.min(1, 'Name is required')
		.max(60, 'Name must be at most 60 characters'),
})

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>

export type CreateCategoryActionResponse = {
	success: boolean
	message: string
	error?: {
		formErrors: string[]
		fieldErrors: {
			[K in keyof CreateCategoryInput]?: string[]
		}
	}
}

export const UpdateCategorySchema = z.object({
	id: z.string().min(1),
	name: z
		.string()
		.min(1, 'Name is required')
		.max(60, 'Name must be at most 60 characters'),
})

export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>

export type UpdateCategoryActionResponse = {
	success: boolean
	message: string
	error?: {
		formErrors: string[]
		fieldErrors: {
			[K in keyof UpdateCategoryInput]?: string[]
		}
	}
}

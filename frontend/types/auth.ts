import { z } from 'zod'

export const UserSchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Name is required'),
	email: z.email('Invalid email address'),
	emailVerified: z.boolean().default(false),
	image: z.string().optional().nullable(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
})

export const SignUpSchema = UserSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	emailVerified: true,
	image: true,
})
	.extend({
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.max(32, 'Password must be at most 32 characters')
			.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
			.regex(/[0-9]/, 'Password must contain at least one number'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

export const SignInSchema = UserSchema.omit({
	id: true,
	name: true,
	createdAt: true,
	updatedAt: true,
	emailVerified: true,
	image: true,
}).extend({
	password: z.string().max(32, 'Password must be at most 32 characters'),
})

export type User = z.infer<typeof UserSchema>
export type SignUpInput = z.infer<typeof SignUpSchema>
export type SignInInput = z.infer<typeof SignInSchema>

export type SignUpActionResponse = {
	success: boolean
	message: string
	error?: {
		formErrors: string[]
		fieldErrors: {
			[K in keyof SignUpInput]?: string[]
		}
	}
}

export type SignInActionResponse = {
	success: boolean
	message: string
	error?: {
		formErrors: string[]
		fieldErrors: {
			[K in keyof SignInInput]?: string[]
		}
	}
}

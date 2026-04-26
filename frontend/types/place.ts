import { z } from 'zod'

const optionalString = (max: number, label: string) =>
	z
		.string()
		.max(max, `${label} must be at most ${max} characters`)
		.optional()
		.or(z.literal('').transform(() => undefined))

export const CreatePlaceSchema = z.object({
	name: z
		.string()
		.min(1, 'Name is required')
		.max(120, 'Name must be at most 120 characters'),
	shortDescription: z
		.string()
		.min(1, 'Short description is required')
		.max(200, 'Short description must be at most 200 characters'),
	fullDescription: z
		.string()
		.min(1, 'Full description is required')
		.max(5000, 'Full description must be at most 5000 characters'),
	openingHours: z
		.string()
		.min(1, 'Opening hours are required')
		.max(200, 'Opening hours must be at most 200 characters'),
	entryFee: z
		.string()
		.min(1, 'Entry fee is required')
		.max(100, 'Entry fee must be at most 100 characters'),
	travelTips: optionalString(2000, 'Travel tips'),
	dressCode: optionalString(500, 'Dress code'),
	categoryId: z
		.string()
		.optional()
		.or(z.literal('').transform(() => undefined)),
	latitude: z
		.union([z.literal(''), z.coerce.number().min(-90).max(90)])
		.optional()
		.transform((v) => (v === '' || v === undefined ? undefined : v)),
	longitude: z
		.union([z.literal(''), z.coerce.number().min(-180).max(180)])
		.optional()
		.transform((v) => (v === '' || v === undefined ? undefined : v)),
	address: optionalString(300, 'Address'),
}).refine(
	(d) =>
		(d.latitude === undefined && d.longitude === undefined) ||
		(d.latitude !== undefined && d.longitude !== undefined),
	{
		message: 'Latitude and longitude must be set together',
		path: ['latitude'],
	},
)

export type CreatePlaceInput = z.infer<typeof CreatePlaceSchema>

export type CreatePlaceActionResponse = {
	success: boolean
	message: string
	placeId?: string
	error?: {
		formErrors: string[]
		fieldErrors: {
			[K in keyof CreatePlaceInput]?: string[]
		}
	}
}

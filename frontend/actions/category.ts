'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import {
	CreateCategoryActionResponse,
	CreateCategorySchema,
	UpdateCategoryActionResponse,
	UpdateCategorySchema,
} from '@/types/category'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export async function createCategory(
	_prevState: CreateCategoryActionResponse,
	formData: FormData,
): Promise<CreateCategoryActionResponse> {
	const session = await auth.api.getSession({ headers: await headers() })

	if (!session || session.user.role !== 'host') {
		return { success: false, message: 'Not authorized' }
	}

	const result = CreateCategorySchema.safeParse(
		Object.fromEntries(formData.entries()),
	)

	if (!result.success) {
		return {
			success: false,
			message: 'Invalid data',
			error: z.flattenError(result.error),
		}
	}

	try {
		await prisma.category.create({
			data: {
				name: result.data.name,
				userId: session.user.id,
			},
		})
	} catch (error: unknown) {
		if (
			typeof error === 'object' &&
			error !== null &&
			'code' in error &&
			(error as { code: string }).code === 'P2002'
		) {
			return {
				success: false,
				message: 'You already have a category with this name',
				error: {
					formErrors: [],
					fieldErrors: { name: ['Name must be unique'] },
				},
			}
		}
		console.error('Failed to create category', error)
		return { success: false, message: 'Failed to create category' }
	}

	revalidatePath('/host/categories')
	redirect('/host/categories')
}

export async function updateCategory(
	_prevState: UpdateCategoryActionResponse,
	formData: FormData,
): Promise<UpdateCategoryActionResponse> {
	const session = await auth.api.getSession({ headers: await headers() })

	if (!session || session.user.role !== 'host') {
		return { success: false, message: 'Not authorized' }
	}

	const result = UpdateCategorySchema.safeParse(
		Object.fromEntries(formData.entries()),
	)

	if (!result.success) {
		return {
			success: false,
			message: 'Invalid data',
			error: z.flattenError(result.error),
		}
	}

	const existing = await prisma.category.findUnique({
		where: { id: result.data.id },
		select: { userId: true },
	})

	if (!existing || existing.userId !== session.user.id) {
		return { success: false, message: 'Category not found' }
	}

	try {
		await prisma.category.update({
			where: { id: result.data.id },
			data: { name: result.data.name },
		})
	} catch (error: unknown) {
		if (
			typeof error === 'object' &&
			error !== null &&
			'code' in error &&
			(error as { code: string }).code === 'P2002'
		) {
			return {
				success: false,
				message: 'You already have a category with this name',
				error: {
					formErrors: [],
					fieldErrors: { name: ['Name must be unique'] },
				},
			}
		}
		console.error('Failed to update category', error)
		return { success: false, message: 'Failed to update category' }
	}

	revalidatePath('/host/categories')
	redirect('/host/categories')
}

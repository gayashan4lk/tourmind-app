'use server'

import { auth } from '@/lib/auth'
import { SignInSchema, SignUpSchema } from '@/types/auth'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export async function signUp(prevState: any, formData: FormData) {
	const result = SignUpSchema.safeParse(Object.fromEntries(formData.entries()))

	if (!result.success) {
		return {
			success: false,
			message: 'Invalid data',
			error: z.flattenError(result.error),
		}
	}

	try {
		await auth.api.signUpEmail({
			body: {
				name: result.data.name,
				email: result.data.email,
				password: result.data.password,
				role: result.data.role,
			},
		})
	} catch (error) {
		console.error('User registration failed', error)
		return {
			success: false,
			message: `Failed to register user: ${error}`,
		}
	}

	return {
		success: true,
		message: 'all good',
	}
}

export async function signIn(prevState: any, formData: FormData) {
	const result = SignInSchema.safeParse(Object.fromEntries(formData.entries()))

	if (!result.success) {
		return {
			success: false,
			message: 'Invalid data',
			error: z.flattenError(result.error),
		}
	}

	try {
		await auth.api.signInEmail({
			body: {
				email: result.data.email,
				password: result.data.password,
			},
		})
	} catch (error) {
		console.error('User login failed', error)
		return {
			success: false,
			message: `Failed to login: ${error}`,
		}
	}

	revalidatePath('/dashboard')
	redirect('/dashboard')

	return {
		success: true,
		message: 'all good',
	}
}

export async function signOut() {
	try {
		await auth.api.signOut({
			headers: await headers(),
		})
	} catch (error) {
		console.error('User logout failed', error)
		return {
			success: false,
			message: 'Failed to logout',
		}
	}

	revalidatePath('/')
	redirect('/')

	return {
		success: true,
		message: 'all good',
	}
}

export async function signInGithub() {
	const response = await auth.api.signInSocial({
		headers: await headers(),
		body: {
			provider: 'github',
			callbackURL: '/',
		},
		asResponse: true,
	})

	const location = response.headers.get('location')
	if (location) redirect(location)
}

export async function signInGoogle() {
	const response = await auth.api.signInSocial({
		headers: await headers(),
		body: {
			provider: 'google',
			callbackURL: '/',
		},
		asResponse: true,
	})

	const location = response.headers.get('location')
	if (location) redirect(location)
}

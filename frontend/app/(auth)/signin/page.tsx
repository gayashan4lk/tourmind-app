'use client'

import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from '@/components/ui/field'
import { signIn, signInGithub, signInGoogle, signUp } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useActionState } from 'react'
import { SignInActionResponse } from '@/types/auth'

const initialState: SignInActionResponse = {
	success: false,
	message: '',
}

export default function Signin() {
	const [state, action, isPending] = useActionState(signIn, initialState)

	return (
		<div className="@container">
			<div className="mx-auto my-4 @sm:w-sm">
				<form action={action}>
					<FieldSet>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input type="email" name="email" id="email" />
								{state.error?.fieldErrors.email?.map((error) => (
									<FieldError key={error}>{error}</FieldError>
								))}
							</Field>
							<Field>
								<FieldLabel htmlFor="password">Password</FieldLabel>
								<Input type="password" name="password" id="password" />
								{state.error?.fieldErrors.password?.map((error) => (
									<FieldError key={error}>{error}</FieldError>
								))}
							</Field>

							{state.message && (
								<p
									className={`text-sm ${state.success ? 'text-green-500' : 'text-red-500'}`}
								>
									{state.message}
								</p>
							)}

							<Field orientation="responsive">
								<Button
									type="submit"
									disabled={isPending}
									className="hover:bg-brand-red"
								>
									Login
								</Button>
							</Field>
						</FieldGroup>
					</FieldSet>
				</form>
				<div className="mt-4 flex flex-row gap-4">
					<div>
						<Button className="hover:bg-brand-red" onClick={signInGithub}>
							Sign in with Github
						</Button>
					</div>
					<div>
						<Button className="hover:bg-brand-red" onClick={signInGoogle}>
							Sign in with Google
						</Button>
					</div>
				</div>

				<div className="mt-4">
					<span className="text-sm">
						Not registered?{' '}
						<Link className="text-blue-500" href="/signup">
							Signup
						</Link>
					</span>
				</div>
			</div>
		</div>
	)
}

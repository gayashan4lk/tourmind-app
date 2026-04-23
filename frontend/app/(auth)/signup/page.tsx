'use client'

import { signUp } from '@/actions/auth'
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
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { SignUpActionResponse, SignUpInput } from '@/types/auth'
import Link from 'next/link'
import { useActionState } from 'react'

const initialState: SignUpActionResponse = {
	success: false,
	message: '',
}

export default function Signup() {
	const [state, action, isPending] = useActionState(signUp, initialState)

	return (
		<div>
			<main>
				<div className="@container">
					<div className="mx-auto my-4 @sm:w-sm">
						<form action={action}>
							<FieldSet>
								<FieldGroup>
									<Field>
										<FieldLabel htmlFor="name">Name</FieldLabel>
										<Input type="text" placeholder="Name" name="name" />
										{state.error?.fieldErrors.name?.map((error) => (
											<FieldError key={error}>{error}</FieldError>
										))}
									</Field>
									<Field>
										<FieldLabel htmlFor="email">Email</FieldLabel>
										<Input type="email" placeholder="Email" name="email" />
										{state.error?.fieldErrors.email?.map((error) => (
											<FieldError key={error}>{error}</FieldError>
										))}
									</Field>
									<Field>
										<FieldLabel htmlFor="password">Password</FieldLabel>
										<Input
											type="password"
											placeholder="Password"
											name="password"
										/>
										{state.error?.fieldErrors.password?.map((error) => (
											<FieldError key={error}>{error}</FieldError>
										))}
									</Field>
									<Field>
										<FieldLabel htmlFor="confirmPassword">
											Confirm Password
										</FieldLabel>
										<Input
											type="password"
											placeholder="Confirm Password"
											name="confirmPassword"
										/>
										{state.error?.fieldErrors.confirmPassword?.map((error) => (
											<FieldError key={error}>{error}</FieldError>
										))}
									</Field>

									<Field>
										<FieldLabel htmlFor="role">I want to sign up as</FieldLabel>
										<Select name="role" defaultValue="tourist">
											<SelectTrigger id="role" className="w-full">
												<SelectValue placeholder="Select a role" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="host">Host</SelectItem>
												<SelectItem value="tourist">Tourist</SelectItem>
											</SelectContent>
										</Select>
									</Field>

									{state.message && (
										<p
											className={`text-sm ${state.success ? 'text-green-500' : 'text-red-500'}`}
										>
											{state.message}
										</p>
									)}

									<Field>
										<Button
											className="hover:bg-brand-red"
											type="submit"
											disabled={isPending}
										>
											Register
										</Button>
									</Field>
								</FieldGroup>
							</FieldSet>
						</form>

						<div className="mt-4">
							<p className="text-sm">
								Already have an account?{' '}
								<Link className="text-blue-500" href="/signin">
									Login
								</Link>
							</p>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}

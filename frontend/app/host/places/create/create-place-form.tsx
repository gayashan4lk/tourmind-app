'use client'

import { createPlace } from '@/actions/place'
import { getPlaceImageUploadUrl, savePlaceImage } from '@/actions/image'
import LocationPicker from './_components/location-picker'
import { Button } from '@/components/ui/button'
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CreatePlaceActionResponse } from '@/types/place'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useRef, useState } from 'react'

const initialState: CreatePlaceActionResponse = {
	success: false,
	message: '',
}

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']

type CategoryOption = { id: string; name: string }

export default function CreatePlaceForm({
	categories,
}: {
	categories: CategoryOption[]
}) {
	const router = useRouter()
	const [state, action, isPending] = useActionState(createPlace, initialState)
	const [file, setFile] = useState<File | null>(null)
	const [fileError, setFileError] = useState<string | null>(null)
	const [isUploading, setIsUploading] = useState(false)
	const [uploadError, setUploadError] = useState<string | null>(null)
	const handledPlaceId = useRef<string | null>(null)

	function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
		setFileError(null)
		const selected = e.target.files?.[0] ?? null
		if (!selected) {
			setFile(null)
			return
		}
		if (!ALLOWED_MIME.includes(selected.type)) {
			setFileError('Only JPEG, PNG, or WebP allowed')
			setFile(null)
			return
		}
		if (selected.size > MAX_FILE_SIZE) {
			setFileError('File must be under 5 MB')
			setFile(null)
			return
		}
		setFile(selected)
	}

	useEffect(() => {
		if (!state.success || !state.placeId) return
		if (handledPlaceId.current === state.placeId) return
		handledPlaceId.current = state.placeId
		const placeId = state.placeId

		async function finish() {
			if (!file) {
				router.push(`/host/places/${placeId}`)
				return
			}
			setIsUploading(true)
			setUploadError(null)
			try {
				const urlResp = await getPlaceImageUploadUrl(
					placeId,
					file.type,
					file.size,
				)
				if (!urlResp.success) {
					setUploadError(urlResp.message)
					return
				}
				const putRes = await fetch(urlResp.uploadUrl, {
					method: 'PUT',
					body: file,
					headers: { 'Content-Type': file.type },
				})
				if (!putRes.ok) {
					setUploadError(
						'Upload to S3 failed — place was created without an image',
					)
					return
				}
				const saveRes = await savePlaceImage(placeId, urlResp.publicUrl)
				if (!saveRes.success) {
					setUploadError(saveRes.message)
					return
				}
				router.push(`/host/places/${placeId}`)
			} catch (err) {
				console.error(err)
				setUploadError('Something went wrong during upload')
			} finally {
				setIsUploading(false)
			}
		}
		finish()
	}, [state.success, state.placeId, file, router])

	const busy = isPending || isUploading

	return (
		<form action={action}>
			<FieldSet>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="name">Name</FieldLabel>
						<Input
							id="name"
							name="name"
							type="text"
							placeholder="e.g. Galle Fort"
							autoFocus
							required
						/>
						{state.error?.fieldErrors.name?.map((error) => (
							<FieldError key={error}>{error}</FieldError>
						))}
					</Field>

					<Field>
						<FieldLabel htmlFor="shortDescription">
							Short description
						</FieldLabel>
						<Textarea
							id="shortDescription"
							name="shortDescription"
							placeholder="A one-liner shown in listings"
							rows={2}
							required
						/>
						{state.error?.fieldErrors.shortDescription?.map((error) => (
							<FieldError key={error}>{error}</FieldError>
						))}
					</Field>

					<Field>
						<FieldLabel htmlFor="fullDescription">Full description</FieldLabel>
						<Textarea
							id="fullDescription"
							name="fullDescription"
							placeholder="Tell travelers about this place"
							rows={6}
							required
						/>
						{state.error?.fieldErrors.fullDescription?.map((error) => (
							<FieldError key={error}>{error}</FieldError>
						))}
					</Field>

					<Field>
						<FieldLabel htmlFor="openingHours">Opening hours</FieldLabel>
						<Input
							id="openingHours"
							name="openingHours"
							type="text"
							placeholder="e.g. Mon–Sun, 9am–6pm"
							required
						/>
						{state.error?.fieldErrors.openingHours?.map((error) => (
							<FieldError key={error}>{error}</FieldError>
						))}
					</Field>

					<Field>
						<FieldLabel htmlFor="entryFee">Entry fee</FieldLabel>
						<Input
							id="entryFee"
							name="entryFee"
							type="text"
							placeholder="e.g. Free, LKR 500, USD 10"
							required
						/>
						{state.error?.fieldErrors.entryFee?.map((error) => (
							<FieldError key={error}>{error}</FieldError>
						))}
					</Field>

					<Field>
						<FieldLabel htmlFor="categoryId">Category</FieldLabel>
						<Select name="categoryId">
							<SelectTrigger id="categoryId" className="w-full">
								<SelectValue
									placeholder={
										categories.length === 0
											? 'No categories yet'
											: 'Select a category (optional)'
									}
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{categories.map((category) => (
										<SelectItem key={category.id} value={category.id}>
											{category.name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
						{state.error?.fieldErrors.categoryId?.map((error) => (
							<FieldError key={error}>{error}</FieldError>
						))}
					</Field>

					<Field>
						<FieldLabel>Location</FieldLabel>
						<LocationPicker />
						<FieldDescription>
							Optional. Search for a place or drag the pin to set the
							location.
						</FieldDescription>
						{state.error?.fieldErrors.latitude?.map((error) => (
							<FieldError key={error}>{error}</FieldError>
						))}
						{state.error?.fieldErrors.longitude?.map((error) => (
							<FieldError key={error}>{error}</FieldError>
						))}
						{state.error?.fieldErrors.address?.map((error) => (
							<FieldError key={error}>{error}</FieldError>
						))}
					</Field>

					<Field>
						<FieldLabel htmlFor="travelTips">Travel tips</FieldLabel>
						<Textarea
							id="travelTips"
							name="travelTips"
							placeholder="Optional: what to bring, best time to visit..."
							rows={4}
						/>
						{state.error?.fieldErrors.travelTips?.map((error) => (
							<FieldError key={error}>{error}</FieldError>
						))}
					</Field>

					<Field>
						<FieldLabel htmlFor="dressCode">Dress code</FieldLabel>
						<Textarea
							id="dressCode"
							name="dressCode"
							placeholder="Optional: any dress code requirements"
							rows={2}
						/>
						{state.error?.fieldErrors.dressCode?.map((error) => (
							<FieldError key={error}>{error}</FieldError>
						))}
					</Field>

					<Field>
						<FieldLabel htmlFor="coverImage">Cover image</FieldLabel>
						<Input
							id="coverImage"
							type="file"
							accept={ALLOWED_MIME.join(',')}
							onChange={handleFileSelect}
							disabled={busy}
							className="cursor-pointer"
						/>
						<FieldDescription>
							Optional. JPEG, PNG, or WebP. Max 5 MB.
						</FieldDescription>
						{fileError && <FieldError>{fileError}</FieldError>}
					</Field>

					{state.message && !state.success && (
						<p className="text-sm text-red-500">{state.message}</p>
					)}
					{uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

					<Field>
						<div className="flex items-center gap-3">
							<Button
								type="submit"
								disabled={busy}
								className="bg-brand-red hover:bg-brand-red/80 h-9 rounded-full px-6 text-base font-semibold text-white"
							>
								{isPending
									? 'Creating...'
									: isUploading
										? 'Uploading image...'
										: 'Create'}
							</Button>
							<Button
								asChild
								variant="outline"
								className="h-9 rounded-full px-6 text-base font-semibold"
							>
								<Link href="/host/places">Cancel</Link>
							</Button>
						</div>
					</Field>
				</FieldGroup>
			</FieldSet>
		</form>
	)
}

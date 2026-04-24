'use client'

import {
	deletePlaceImage,
	getPlaceImageUploadUrl,
	savePlaceImage,
} from '@/actions/image'
import { Button } from '@/components/ui/button'
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']

type Props = {
	placeId: string
	currentImageUrl?: string | null
	currentImageId?: string | null
}

export default function PlaceImageUpload({
	placeId,
	currentImageUrl,
	currentImageId,
}: Props) {
	const router = useRouter()
	const [file, setFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [isUploading, setIsUploading] = useState(false)
	const [isDeleting, startDeleteTransition] = useTransition()
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (!file) {
			setPreviewUrl(null)
			return
		}
		const url = URL.createObjectURL(file)
		setPreviewUrl(url)
		return () => URL.revokeObjectURL(url)
	}, [file])

	function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
		setError(null)
		const selected = e.target.files?.[0] ?? null
		if (!selected) {
			setFile(null)
			return
		}
		if (!ALLOWED_MIME.includes(selected.type)) {
			setError('Only JPEG, PNG, or WebP allowed')
			setFile(null)
			return
		}
		if (selected.size > MAX_FILE_SIZE) {
			setError('File must be under 5 MB')
			setFile(null)
			return
		}
		setFile(selected)
	}

	async function handleUpload() {
		if (!file) return
		setError(null)
		setIsUploading(true)
		try {
			const urlResp = await getPlaceImageUploadUrl(
				placeId,
				file.type,
				file.size,
			)
			if (!urlResp.success) {
				setError(urlResp.message)
				return
			}
			const putRes = await fetch(urlResp.uploadUrl, {
				method: 'PUT',
				body: file,
				headers: { 'Content-Type': file.type },
			})
			if (!putRes.ok) {
				setError('Upload to S3 failed')
				return
			}
			const saveRes = await savePlaceImage(placeId, urlResp.publicUrl)
			if (!saveRes.success) {
				setError(saveRes.message)
				return
			}
			setFile(null)
			if (inputRef.current) inputRef.current.value = ''
			router.refresh()
		} catch (err) {
			console.error(err)
			setError('Something went wrong')
		} finally {
			setIsUploading(false)
		}
	}

	function handleRemove() {
		if (!currentImageId) return
		setError(null)
		startDeleteTransition(async () => {
			const res = await deletePlaceImage(currentImageId)
			if (!res.success) {
				setError(res.message)
				return
			}
			router.refresh()
		})
	}

	const displayUrl = previewUrl ?? currentImageUrl ?? null

	return (
		<div className="flex flex-col gap-4">
			<div className="relative aspect-[220/180] w-full max-w-sm overflow-hidden rounded-2xl bg-neutral-200">
				{displayUrl ? (
					<Image
						src={displayUrl}
						alt="Place image"
						fill
						sizes="(max-width: 640px) 100vw, 384px"
						className="object-cover"
						unoptimized={previewUrl !== null}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center text-sm text-neutral-500">
						No image yet
					</div>
				)}
			</div>

			<Field>
				<FieldLabel htmlFor="place-image">Cover image</FieldLabel>
				<Input
					ref={inputRef}
					id="place-image"
					type="file"
					accept={ALLOWED_MIME.join(',')}
					onChange={handleSelect}
					disabled={isUploading || isDeleting}
					className="cursor-pointer"
				/>
				<FieldDescription>JPEG, PNG, or WebP. Max 5 MB.</FieldDescription>
				{error && <FieldError>{error}</FieldError>}
			</Field>

			<div className="flex items-center gap-3">
				<Button
					type="button"
					onClick={handleUpload}
					disabled={!file || isUploading || isDeleting}
					className="bg-brand-red hover:bg-brand-red/80 h-9 rounded-full px-6 text-base font-semibold text-white"
				>
					{isUploading
						? 'Uploading...'
						: currentImageUrl
							? 'Replace image'
							: 'Upload image'}
				</Button>
				{currentImageId && (
					<Button
						type="button"
						variant="outline"
						onClick={handleRemove}
						disabled={isUploading || isDeleting}
						className="h-9 rounded-full px-6 text-base font-semibold"
					>
						{isDeleting ? 'Removing...' : 'Remove'}
					</Button>
				)}
			</div>
		</div>
	)
}

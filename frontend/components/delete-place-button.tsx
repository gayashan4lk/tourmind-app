'use client'

import { deletePlace } from '@/actions/place'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

type Props = {
	placeId: string
	placeName: string
	redirectAfter?: boolean
	variant?: 'button' | 'icon'
}

export default function DeletePlaceButton({
	placeId,
	placeName,
	redirectAfter = false,
	variant = 'button',
}: Props) {
	const router = useRouter()
	const [open, setOpen] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [isPending, startTransition] = useTransition()

	function handleConfirm(e: React.MouseEvent) {
		e.preventDefault()
		setError(null)
		startTransition(async () => {
			const res = await deletePlace(placeId)
			if (!res.success) {
				setError(res.message)
				return
			}
			setOpen(false)
			if (redirectAfter) {
				router.push('/host/places')
			} else {
				router.refresh()
			}
		})
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				{variant === 'icon' ? (
					<button
						type="button"
						aria-label={`Delete ${placeName}`}
						className={cn(
							'absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full',
							'bg-black/60 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/80',
							'focus-visible:opacity-100 focus-visible:outline-none',
						)}
					>
						<Trash2 className="h-4 w-4" />
					</button>
				) : (
					<Button
						type="button"
						variant="outline"
						className="h-9 rounded-full border-red-500 px-6 text-base font-semibold text-red-600 hover:bg-red-50"
					>
						<Trash2 className="mr-2 h-4 w-4" />
						Delete place
					</Button>
				)}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete “{placeName}”?</AlertDialogTitle>
					<AlertDialogDescription>
						This permanently removes the place and all of its images. This
						action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				{error && <p className="text-sm text-red-500">{error}</p>}
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleConfirm}
						disabled={isPending}
						className="bg-red-600 text-white hover:bg-red-700"
					>
						{isPending ? 'Deleting...' : 'Delete'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

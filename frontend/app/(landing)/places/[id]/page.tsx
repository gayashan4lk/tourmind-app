import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'
import PlaceDetails from '@/components/app/shared/place-details'

export default async function PublicPlaceDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	return <PlaceDetails id={id} from="/" />
}

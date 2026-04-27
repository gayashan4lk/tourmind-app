import PlaceDetails from '@/components/app/shared/place-details'

export default async function TourPlaceDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	return <PlaceDetails id={id} from="/tour" />
}

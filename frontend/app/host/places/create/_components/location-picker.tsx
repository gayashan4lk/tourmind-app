'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
	APIProvider,
	AdvancedMarker,
	Map,
	useMap,
	useMapsLibrary,
} from '@vis.gl/react-google-maps'
import { useEffect, useRef, useState } from 'react'

const SRI_LANKA_CENTER = { lat: 7.8731, lng: 80.7718 }
const DEFAULT_ZOOM = 6
const SELECTED_ZOOM = 15

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

type LatLng = { lat: number; lng: number }

export default function LocationPicker() {
	const [position, setPosition] = useState<LatLng | null>(null)
	const [address, setAddress] = useState('')

	if (!apiKey) {
		return (
			<p className="text-sm text-red-500">
				Google Maps API key not configured. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
				in .env.
			</p>
		)
	}

	function handleClear() {
		setPosition(null)
		setAddress('')
	}

	return (
		<APIProvider apiKey={apiKey}>
			<div className="flex flex-col gap-3">
				<AutocompleteInput
					onPlaceSelect={(p) => {
						setPosition(p.position)
						setAddress(p.address)
					}}
				/>
				{address && <p className="text-sm text-neutral-600">{address}</p>}

				<div className="h-72 w-full overflow-hidden rounded-md border">
					<Map
						mapId="place-location-picker"
						defaultCenter={SRI_LANKA_CENTER}
						defaultZoom={DEFAULT_ZOOM}
						gestureHandling="greedy"
						disableDefaultUI={false}
					>
						<MapController position={position} />
						{position && (
							<AdvancedMarker
								position={position}
								draggable
								onDragEnd={(e) => {
									const lat = e.latLng?.lat()
									const lng = e.latLng?.lng()
									if (lat == null || lng == null) return
									setPosition({ lat, lng })
								}}
							/>
						)}
					</Map>
				</div>

				<ReverseGeocoder position={position} onAddress={setAddress} />

				<div className="flex items-center justify-between text-xs text-neutral-500">
					<span>
						{position
							? `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`
							: 'No location selected'}
					</span>
					{position && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={handleClear}
						>
							Clear location
						</Button>
					)}
				</div>

				<input type="hidden" name="latitude" value={position?.lat ?? ''} />
				<input type="hidden" name="longitude" value={position?.lng ?? ''} />
				<input type="hidden" name="address" value={address} />
			</div>
		</APIProvider>
	)
}

function AutocompleteInput({
	onPlaceSelect,
}: {
	onPlaceSelect: (p: { position: LatLng; address: string }) => void
}) {
	const places = useMapsLibrary('places')
	const containerRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!places || !containerRef.current) return
		const PlaceAutocompleteElement = (
			places as unknown as {
				PlaceAutocompleteElement: new () => HTMLElement
			}
		).PlaceAutocompleteElement
		if (!PlaceAutocompleteElement) return
		const el = new PlaceAutocompleteElement()
		el.setAttribute('placeholder', 'Search for a place or address')
		containerRef.current.replaceChildren(el)

		const handler = async (
			event: Event & {
				placePrediction?: {
					toPlace: () => {
						fetchFields: (opts: { fields: string[] }) => Promise<unknown>
						location: { lat: () => number; lng: () => number } | null
						formattedAddress?: string | null
						displayName?: string | null
					}
				}
			},
		) => {
			const prediction = event.placePrediction
			if (!prediction) return
			const place = prediction.toPlace()
			try {
				await place.fetchFields({
					fields: ['location', 'formattedAddress', 'displayName'],
				})
			} catch (err) {
				console.error('PlaceAutocomplete fetchFields failed', err)
				return
			}
			const loc = place.location
			if (!loc) return
			onPlaceSelect({
				position: { lat: loc.lat(), lng: loc.lng() },
				address: place.formattedAddress ?? place.displayName ?? '',
			})
		}
		el.addEventListener('gmp-select', handler as EventListener)
		return () => {
			el.removeEventListener('gmp-select', handler as EventListener)
			el.remove()
		}
	}, [places, onPlaceSelect])

	return (
		<div
			ref={containerRef}
			className={cn(
				'[&_gmp-place-autocomplete]:block [&_gmp-place-autocomplete]:w-full',
			)}
		/>
	)
}

function MapController({ position }: { position: LatLng | null }) {
	const map = useMap()
	useEffect(() => {
		if (!map || !position) return
		map.panTo(position)
		const z = map.getZoom() ?? 0
		if (z < SELECTED_ZOOM) map.setZoom(SELECTED_ZOOM)
	}, [map, position])
	return null
}

function ReverseGeocoder({
	position,
	onAddress,
}: {
	position: LatLng | null
	onAddress: (a: string) => void
}) {
	const geocoding = useMapsLibrary('geocoding')
	const lastKeyRef = useRef<string | null>(null)

	useEffect(() => {
		if (!geocoding || !position) return
		const key = `${position.lat.toFixed(6)},${position.lng.toFixed(6)}`
		if (lastKeyRef.current === key) return
		lastKeyRef.current = key
		const geocoder = new geocoding.Geocoder()
		geocoder
			.geocode({ location: position })
			.then((res: any) => {
				const formatted = res.results[0]?.formatted_address
				if (formatted) onAddress(formatted)
			})
			.catch(() => {
				/* ignore — keep prior address */
			})
	}, [geocoding, position, onAddress])

	return null
}

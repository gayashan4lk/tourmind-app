import {
	BedDouble,
	Building2,
	Car,
	Church,
	Compass,
	Landmark,
	Moon,
	Mountain,
	Palette,
	PartyPopper,
	PawPrint,
	ShoppingBag,
	Tag,
	Trees,
	Utensils,
	Waves,
	type LucideIcon,
} from 'lucide-react'

const ICON_KEYWORDS: Array<{ keywords: string[]; icon: LucideIcon }> = [
	{ keywords: ['beach', 'sea', 'coast', 'ocean', 'surf'], icon: Waves },
	{ keywords: ['mountain', 'hike', 'peak', 'trek', 'hill'], icon: Mountain },
	{
		keywords: ['food', 'restaurant', 'cafe', 'eat', 'dining', 'cuisine'],
		icon: Utensils,
	},
	{ keywords: ['city', 'urban', 'downtown'], icon: Building2 },
	{ keywords: ['nature', 'forest', 'park', 'tree', 'jungle'], icon: Trees },
	{
		keywords: ['history', 'heritage', 'museum', 'monument', 'ruins'],
		icon: Landmark,
	},
	{ keywords: ['temple', 'church', 'religious', 'spiritual'], icon: Church },
	{ keywords: ['adventure', 'thrill', 'explore'], icon: Compass },
	{ keywords: ['shopping', 'market', 'bazaar', 'mall'], icon: ShoppingBag },
	{ keywords: ['night', 'bar', 'club', 'pub'], icon: Moon },
	{ keywords: ['culture', 'art', 'gallery'], icon: Palette },
	{ keywords: ['wildlife', 'safari', 'animal', 'zoo'], icon: PawPrint },
	{ keywords: ['hotel', 'stay', 'resort', 'accommodation'], icon: BedDouble },
	{ keywords: ['festival', 'event', 'celebration'], icon: PartyPopper },
	{ keywords: ['road', 'drive', 'tour', 'trip'], icon: Car },
]

const PALETTE: Array<{ bg: string; fg: string }> = [
	{ bg: 'bg-rose-100', fg: 'text-rose-600' },
	{ bg: 'bg-amber-100', fg: 'text-amber-600' },
	{ bg: 'bg-emerald-100', fg: 'text-emerald-600' },
	{ bg: 'bg-sky-100', fg: 'text-sky-600' },
	{ bg: 'bg-violet-100', fg: 'text-violet-600' },
	{ bg: 'bg-fuchsia-100', fg: 'text-fuchsia-600' },
	{ bg: 'bg-teal-100', fg: 'text-teal-600' },
	{ bg: 'bg-orange-100', fg: 'text-orange-600' },
	{ bg: 'bg-lime-100', fg: 'text-lime-600' },
	{ bg: 'bg-indigo-100', fg: 'text-indigo-600' },
]

function pickIcon(name: string): LucideIcon {
	const lower = name.toLowerCase()
	for (const { keywords, icon } of ICON_KEYWORDS) {
		if (keywords.some((k) => lower.includes(k))) return icon
	}
	return Tag
}

function hashString(input: string): number {
	let hash = 0
	for (let i = 0; i < input.length; i++) {
		hash = (hash * 31 + input.charCodeAt(i)) >>> 0
	}
	return hash
}

export function getCategoryVisual(name: string) {
	const palette = PALETTE[hashString(name.toLowerCase()) % PALETTE.length]
	return {
		Icon: pickIcon(name),
		bgClass: palette.bg,
		fgClass: palette.fg,
	}
}

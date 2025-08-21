const NOT_AVAILABLE = 'N/A'

export function formatDuration(hours: number | null | undefined): string {
	if (hours == null || !Number.isFinite(hours)) {
		return NOT_AVAILABLE
	}

	const positiveHours = Math.max(0, hours)
	const totalMinutes = Math.floor(positiveHours * 60)
	const h = Math.floor(totalMinutes / 60)
	const m = totalMinutes % 60

	return `${h}h ${m}m`
}

export function formatTimeOnly(dateSource: string | Date | null | undefined): string {
	if (!dateSource) return NOT_AVAILABLE

	try {
		const date = new Date(dateSource)
		if (isNaN(date.getTime())) return NOT_AVAILABLE

		return date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		})
	} catch (e) {
		return NOT_AVAILABLE
	}
}

export function formattedDate(dateSource: string | Date | null | undefined): string {
	if (!dateSource) return NOT_AVAILABLE

	try {
		const date = new Date(dateSource)
		if (isNaN(date.getTime())) return NOT_AVAILABLE

		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
	} catch (e) {
		return NOT_AVAILABLE
	}
}

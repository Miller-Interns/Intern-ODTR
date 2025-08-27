const NOT_AVAILABLE = 'N/A'

export function formatDuration(hours: number | null | undefined): string {
	// Guard clause remains the same, but added an explicit check for negative numbers.
	if (hours == null || !Number.isFinite(hours) || hours < 0) {
		return NOT_AVAILABLE
	}

	// Handle the zero case cleanly.
	if (hours === 0) {
		return '0m'
	}

	// Use Math.round for better accuracy with floating point numbers.
	const totalMinutes = Math.round(hours * 60)
	const h = Math.floor(totalMinutes / 60)
	const m = totalMinutes % 60

	const parts: string[] = []

	if (h > 0) {
		parts.push(`${h}h`)
	}
	if (m > 0) {
		parts.push(`${m}m`)
	}

	// Join the parts with a space, e.g., "7h 30m", "7h", or "30m"
	return parts.join(' ')
}

// This helper function centralizes the date validation logic.
function safeCreateDate(dateSource: string | Date | null | undefined): Date | null {
	if (!dateSource) {
		return null
	}
	try {
		const date = new Date(dateSource)
		// The most robust way to check for "Invalid Date"
		if (isNaN(date.getTime())) {
			return null
		}
		return date
	} catch (e) {
		// The Date constructor rarely throws, but this makes the function completely safe.
		return null
	}
}

export function formatTimeOnly(dateSource: string | Date | null | undefined): string {
	const date = safeCreateDate(dateSource)
	if (!date) {
		return NOT_AVAILABLE
	}

	return date.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	})
}

export function formattedDate(dateSource: string | Date | null | undefined): string {
	const date = safeCreateDate(dateSource)
	if (!date) {
		return NOT_AVAILABLE
	}

	return date.toLocaleDateString('en-US', {
		weekday: 'short',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
}

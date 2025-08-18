export const formattedDate = (dateString: string | Date | null) => {
	if (!dateString) return ''
	return new Date(String(dateString)).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
}

export const formatTime = (dateString: string | Date | null) => {
	if (!dateString) return ''
	return new Date(String(dateString)).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

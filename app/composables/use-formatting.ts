export function useFormatting() {
  function formatTimeOnly(dateString: string | null): string {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Time'

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  function formatDuration(hours: number | null | undefined): string {
    if (hours === null || hours === undefined) return '0 Hours'
    const formattedHours = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
    }).format(hours)
    return `${formattedHours} Hours`
  }

  return {
    formatTimeOnly,
    formatDuration,
  }
}
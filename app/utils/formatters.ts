export function formatHours(hours: number | null | undefined): string {
    if (typeof hours !== 'number') return "0.0";
    return (hours).toFixed(1);
}

export function formatTimeOnly(dateString: string | null): string {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Time';

        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    } catch (e) {
        return 'Invalid Time';
    }
}

export function formatDuration(hours: number | null | undefined): string {
    if (hours === null || hours === undefined) return '0 Hours';
    const formattedHours = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
    }).format(hours);
    return `${formattedHours} Hours`;
}

export function formattedDate(dateString: string | null | Date): string {
    if (!dateString) return 'No Date';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';

        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (e) {
        return 'Invalid Date';
    }
}
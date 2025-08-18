/**
 * A consistent placeholder for invalid or missing data.
 */
const NOT_AVAILABLE = 'N/A';

/**
 * Formats a duration from a decimal number of hours into a more readable "Xh Ym" format.
 * Example: 8.5 becomes "8h 30m".
 *
 * @param hours - The total hours as a number.
 * @returns A formatted string or 'N/A' if the input is invalid.
 */
export function formatDuration(hours: number | null | undefined): string {
    // Return 'N/A' for null, undefined, or non-finite numbers (NaN, Infinity)
    if (hours == null || !Number.isFinite(hours)) {
        return NOT_AVAILABLE;
    }

    // Ensure hours are not negative for duration display
    const positiveHours = Math.max(0, hours);

    const totalMinutes = Math.floor(positiveHours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    return `${h}h ${m}m`;
}

/**
 * Formats a date string or Date object into a localized time-only string.
 * Example: "2025-08-17T14:30:00.000Z" becomes "2:30 PM".
 *
 * @param dateSource - The date string (ISO format recommended) or Date object.
 * @returns A formatted time string or 'N/A' if the input is invalid.
 */
export function formatTimeOnly(dateSource: string | Date | null | undefined): string {
    if (!dateSource) return NOT_AVAILABLE;

    try {
        const date = new Date(dateSource);
        if (isNaN(date.getTime())) return NOT_AVAILABLE; // Invalid date check

        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    } catch (e) {
        // This catch block is a safeguard, though isNaN should handle most cases.
        return NOT_AVAILABLE;
    }
}

/**
 * Formats a date string or Date object into a full, localized date string.
 * Example: "2025-08-17T14:30:00.000Z" becomes "Sun, August 17, 2025".
 *
 * @param dateSource - The date string (ISO format recommended) or Date object.
 * @returns A formatted date string or 'N/A' if the input is invalid.
 */
export function formattedDate(dateSource: string | Date | null | undefined): string {
    if (!dateSource) return NOT_AVAILABLE;

    try {
        const date = new Date(dateSource);
        if (isNaN(date.getTime())) return NOT_AVAILABLE; // Invalid date check

        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (e) {
        return NOT_AVAILABLE;
    }
}
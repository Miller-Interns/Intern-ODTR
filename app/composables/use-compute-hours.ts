export function useTimeLogCalculator() {
    const STANDARD_WORK_MINUTES = 8 * 60; // 480 minutes
    const BREAK_MINUTES = 1 * 60;         // 60 minutes

    function calculateMinutes(timeIn: string | null | Date, timeOut: string | null | Date): { totalMinutes: number; overtimeMinutes: number } {
        if (!timeIn || !timeOut) {
            return { totalMinutes: 0, overtimeMinutes: 0 };
        }

        const startTime = new Date(timeIn);
        const endTime = new Date(timeOut);

        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
            return { totalMinutes: 0, overtimeMinutes: 0 };
        }

        const grossDurationMinutes = (endTime.getTime() - startTime.getTime()) / 60000;
        const netWorkMinutes = Math.max(0, grossDurationMinutes - BREAK_MINUTES);
        const calculatedOvertime = Math.max(0, netWorkMinutes - STANDARD_WORK_MINUTES);
        const regularTime = netWorkMinutes - calculatedOvertime;

        return {
            totalMinutes: Math.round(regularTime),
            overtimeMinutes: Math.round(calculatedOvertime),
        };
    }
    function formatMinutesAsHours(minutes: number | null | undefined): string {
        if (typeof minutes !== 'number') return "0.0";
        return (minutes / 60).toFixed(1);
    }

    return {
        calculateMinutes,
        formatMinutesAsHours,
    };
}
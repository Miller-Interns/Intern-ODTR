export function useTimeLog() {
  const STANDARD_WORK_HOURS = 8;
  const BREAK_HOURS = 1;

  function calculateHours(timeIn: string | null | Date, timeOut: string | null | Date): { totalHours: number; overtimeHours: number } {
    if (!timeIn || !timeOut) {
      return { totalHours: 0, overtimeHours: 0 };
    }

    const startTime = new Date(timeIn);
    const endTime = new Date(timeOut);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return { totalHours: 0, overtimeHours: 0 };
    }

    const grossDurationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    const netWorkHours = Math.max(0, grossDurationHours - BREAK_HOURS);
    const calculatedOvertime = Math.max(0, netWorkHours - STANDARD_WORK_HOURS);

    return {
      totalHours: netWorkHours,
      overtimeHours: calculatedOvertime,
    };
  }

  function formatHours(hours: number | null | undefined): string {
    if (typeof hours !== 'number') return "0.0";
    return (hours).toFixed(1);
  }

  function formatTimeOnly(dateString: string | null): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Time';

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  function formatDuration(hours: number | null | undefined): string {
    if (hours === null || hours === undefined) return '0 Hours';
    const formattedHours = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
    }).format(hours);
    return `${formattedHours} Hours`;
  }

  function formattedDate(timeIn: string | null | Date): string {
    if (!timeIn) {
      return 'No Date';
    }
    const date = new Date(timeIn);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return {
    calculateHours,
    formatHours,
    formatTimeOnly,
    formatDuration,
    formattedDate,
  };
}
import type { RawTimeLog } from '~/types/composites';
import { useFormatting } from '~/composables/use-formatting';

export function useLogDisplay(log: RawTimeLog) {
  const { calculateMinutes } = useTimeLogCalculator();
  const { formatTimeOnly, formatDuration } = useFormatting();

  const totalHoursInDecimal = computed(() => {
    if (log.status) {
      return (log.total_hours || 0) / 60;
    }

    const { totalMinutes } = calculateMinutes(log.time_in, log.time_out);
    return totalMinutes / 60;
  });

  const overtimeInDecimal = computed(() => {
    if (log.status) {
      return (log.overtime || 0) / 60;
    }

    const { overtimeMinutes } = calculateMinutes(log.time_in, log.time_out);
    return overtimeMinutes / 60;
  });

  const formattedDate = computed(() => {
    return new Date(log.time_in).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });

  return {
    formattedDate,
    timeIn: computed(() => formatTimeOnly(log.time_in)),
    timeOut: computed(() => (log.time_out ? formatTimeOnly(log.time_out) : 'N/A')),
    totalHours: computed(() => formatDuration(totalHoursInDecimal.value)),
    overtime: computed(() => formatDuration(overtimeInDecimal.value)),
  };
}
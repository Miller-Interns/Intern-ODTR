import { computed } from 'vue';
import type { TimeLogEntry } from '~/interfaces/time-logs';

export function useTimeLogState(log: TimeLogEntry) {
    const isPending = computed(() => !log.status);

    const derivedStatus = computed<'pending' | 'approved'>(() => {
        return isPending.value ? 'pending' : 'approved';
    });

    return {
        isPending,
        derivedStatus,
    };
}
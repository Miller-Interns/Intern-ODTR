import { computed } from 'vue';
import type { PendingTimeLog } from '~/types/composites';

export function useTimeLogState(log: PendingTimeLog) {
    const isPending = computed(() => !log.status);

    const derivedStatus = computed<'pending' | 'approved'>(() => {
        return isPending.value ? 'pending' : 'approved';
    });

    return {
        isPending,
        derivedStatus,
    };
}
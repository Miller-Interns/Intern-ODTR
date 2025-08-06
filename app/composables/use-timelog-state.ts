import { computed } from 'vue';
import type { RawTimeLog } from '~/types/composites';

export function useTimeLogState(log: RawTimeLog) {
    const isPending = computed(() => !log.status);

    const derivedStatus = computed<'pending' | 'approved'>(() => {
        return isPending.value ? 'pending' : 'approved';
    });

    return {
        isPending,
        derivedStatus,
    };
}
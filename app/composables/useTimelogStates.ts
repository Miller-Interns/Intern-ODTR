import type { InternLog } from '~/types/TimeLog'

export function useTimeLogState(log: InternLog) {
	const isPending = computed(() => !log.status)

	const derivedStatus = computed<'pending' | 'approved'>(() => {
		return isPending.value ? 'pending' : 'approved'
	})

	return {
		isPending,
		derivedStatus,
	}
}

import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { Selectable } from 'kysely'
import type { TimeLog } from '~/server/db/types'

type DashboardDataResponse = {
	activeTimeLog: Selectable<TimeLog> | null
	lastCompletedLog: Selectable<TimeLog> | null
	internStatus: boolean
	requiredHours: number
	renderedHours: number
}

export function useDashboard(renderedHours: Ref<number>, totalHours: Ref<number>) {
	const { session } = useUserSession()
	const toast = useToast()
	const typedUser = computed(() => session.value?.user as { name?: string | null } | undefined)
	const intern_notes = ref('')
	const elapsedTime = ref(0)
	const activeTimeLog = ref<Selectable<TimeLog> | null>(null)
	const lastCompletedLog = ref<Selectable<TimeLog> | null>(null)
	const isSubmitting = ref(false)
	const showRemarksInput = ref(false)
	const internStatus = ref<boolean>(true)
	let timerInterval: NodeJS.Timeout | null = null
	const {
		data: dashboardData,
		pending,
		error,
		refresh,
	} = useFetch<DashboardDataResponse>('/api/timelog/current', { watch: [typedUser], immediate: !!typedUser.value })

	function updateElapsedTime() {
		if (!activeTimeLog.value?.time_in) return
		const timeInDate = new Date(String(activeTimeLog.value.time_in))
		const now = new Date()
		const diffMilliseconds = now.getTime() - timeInDate.getTime()
		elapsedTime.value = diffMilliseconds / (1000 * 60 * 60) //converting milliseconds into hours as a decimal number
	}

	async function handleTimeOut() {
		if (!activeTimeLog.value || isTimeOutDisabled.value) return
		isSubmitting.value = true
		try {
			await $fetch('/api/timelog/timeout', {
				method: 'POST',
				body: {
					timeLogId: activeTimeLog.value.id,
					intern_notes: intern_notes.value,
				},
			})
			toast.add({ id: 'timeout_success', title: 'Time log submitted for approval.', color: 'success' })
			await refresh()
		} catch (err: any) {
			console.error('Failed to time out:', err)
			toast.add({ id: 'timeout_error', title: 'Error', description: err.data?.message || 'Could not process time out.', color: 'error' })
		} finally {
			isSubmitting.value = false
		}
	}

	const isTimeOutDisabled = computed(() => {
		if (isSubmitting.value) {
			return true
		}
		if (elapsedTime.value >= 8) {
			return false
		}
		return intern_notes.value.trim() === ''
	})

	watch(
		dashboardData,
		(newData) => {
			if (timerInterval) clearInterval(timerInterval)
			if (newData && typeof newData === 'object') {
				activeTimeLog.value = newData.activeTimeLog
				lastCompletedLog.value = newData.lastCompletedLog
				renderedHours.value = newData.renderedHours || 0
				totalHours.value = newData.requiredHours || 300

				internStatus.value = newData.internStatus
			}
			if (process.client && activeTimeLog.value) {
				updateElapsedTime()
				timerInterval = setInterval(updateElapsedTime, 1000)
			}
		},
		{ immediate: true },
	)

	const progressPercentage = computed(() => {
		if (!totalHours.value) return 0
		return (renderedHours.value / totalHours.value) * 100
	})

	onMounted(() => {
		if (activeTimeLog.value) {
			updateElapsedTime()
			if (timerInterval) clearInterval(timerInterval)
			timerInterval = setInterval(updateElapsedTime, 1000)
		}
	})

	onUnmounted(() => {
		if (timerInterval) clearInterval(timerInterval)
	})

	return {
		pending,
		error,
		dashboardData,
		typedUser,
		internStatus,
		activeTimeLog,
		lastCompletedLog,
		elapsedTime,
		showRemarksInput,
		intern_notes,
		isTimeOutDisabled,
		isSubmitting,
		progressPercentage,
		handleTimeOut,
	}
}

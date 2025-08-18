import { ref, computed } from 'vue'
import type { Selectable } from 'kysely'
import type { TimeLog } from '~/server/db/types'

// --- Type Definitions ---
interface SessionUser {
	id: string
	email: string
	name: string | null
	isAdmin: boolean
}

type TimeLogWithAdmin = Selectable<TimeLog> & {
	adminName: string | null
}

type TimeLogsResponse = {
	timeLogs: TimeLogWithAdmin[]
}

// This is our new composable function
export function useTimeLogs() {
	const { session } = useUserSession()
	const toast = useToast()
	const typedUser = computed(() => session.value?.user as SessionUser | undefined)

	// --- Data Fetching ---
	const { data, pending, error } = useFetch<TimeLogsResponse>('/api/timelog/list')

	// --- Helper Functions for Formatting ---
	const formattedDate = (dateString: string | Date) => {
		if (!dateString) return ''
		return new Date(String(dateString)).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
	}

	const formatTime = (dateString: string | Date | null) => {
		if (!dateString) return ''
		return new Date(String(dateString)).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
	}

	// Helper for CSV-specific time format
	const format24HourTime = (dateString: string | Date | null): string => {
		if (!dateString) return ''
		const date = new Date(String(dateString))
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')
		return `${hours}:${minutes}`
	}

	// --- CSV Export Logic ---
	function exportDTR() {
		if (!data.value || !data.value.timeLogs || data.value.timeLogs.length === 0) {
			toast.add({ id: 'export_error', title: 'No time logs to export.', color: 'error' })
			return
		}

		const internName = typedUser.value?.name || 'Intern'
		let totalHours = 0

		const metadata = ['"Miller Dev Internship Daily Time Record"', `"Intern Name: ${internName}"`, '"Official Hours: 9:00 - 6:00 PM"', '']
		const headers = ['Date', 'Approved By', 'Time in', 'Time out', 'No. of Hours']

		const rows = data.value.timeLogs.map((log) => {
			totalHours += log.total_hours
			const date = `"${formattedDate(log.time_in)}"`
			const approvedBy = log.adminName ? `${log.adminName}` : 'N/A'
			const timeIn = format24HourTime(log.time_in)
			const timeOut = format24HourTime(log.time_out)
			const hours = log.total_hours.toFixed(1)
			return [date, approvedBy, timeIn, timeOut, hours].join(',')
		})

		const footer = ['', '', '', '"Total No. of Hours:"', totalHours.toFixed(1)]
		const csvContent = [...metadata, headers.join(','), ...rows, footer.join(',')].join('\n')

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
		const link = document.createElement('a')
		const url = URL.createObjectURL(blob)
		link.setAttribute('href', url)

		const userNameForFile = internName.replace(/\s+/g, '_')
		link.setAttribute('download', `DTR_${userNameForFile}.csv`)

		link.style.visibility = 'hidden'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		URL.revokeObjectURL(url)

		toast.add({ id: 'export_success', title: 'DTR exported successfully!', color: 'success' })
	}

	// --- Return Values ---
	// We explicitly return all the state and methods that the component will need.
	return {
		pending,
		error,
		data,
		formattedDate,
		formatTime,
		exportDTR,
	}
}

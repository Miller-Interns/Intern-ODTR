<template>
	<div class="flex min-h-screen flex-col bg-gray-50 pb-20">
		<div v-if="pending" class="flex flex-1 items-center justify-center">
			<p>Loading Dashboard...</p>
		</div>

		<div v-else-if="error" class="flex flex-1 items-center justify-center text-center text-red-500">
			<p>
				Could not load dashboard data.
				<br />
				Please try again later.
			</p>
			<pre v-if="error.message" class="text-black-400 mt-2 text-xs">{{ error.message }}</pre>
		</div>

		<div v-else-if="dashboardData && typedUser" class="space-y-6 p-4">
			<header>
				<h1 class="text-black-800 text-2xl font-bold">Welcome back,</h1>
				<h1 class="text-black-800 text-2xl font-bold">{{ typedUser.name || 'Intern' }}</h1>
				<p v-if="!internStatus" class="pt-2 pb-3 text-amber-600 italic">
					Your account is currently inactive.
				</p>
				<p v-else-if="activeTimeLog" class="text-black-500 pt-2 pb-3 italic">
					Your time log is in progress
				</p>
				<p v-else-if="lastCompletedLog" class="text-black-500 pt-2 pb-3 italic">
					Your time log has been submitted for today, Great Job!
				</p>
				<p v-else class="text-black-500 pt-2 pb-3 italic">
					You are currently timed out.
				</p>
			</header>

			<div v-if="!internStatus">
				<UCard class="shadow-lg">
					<div class="text-center">
						<p class="mb-4">Your account is currently inactive. You cannot time in until an administrator
							reactivates your account.</p>
					</div>
				</UCard>
			</div>

			<div v-else-if="activeTimeLog">
				<h2 class="pb-4 text-xl font-semibold">Time Log Summary</h2>
				<UCard class="mb-6 shadow-lg">
					<template #header>
						<p class="text-l text-black">{{ formattedDate(activeTimeLog.time_in) }}</p>
					</template>
					<div class="mb-6 space-y-4">
						<div>
							<p class="text-black-500 text-sm">Time in:</p>
							<p class="text-lg font-semibold">{{ formatTime(activeTimeLog.time_in) }}</p>
						</div>
						<div class="rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 p-4 text-center">
							<p class="text-black-500 text-sm">Elapsed Time:</p>
							<p class="text-xl font-bold">{{ elapsedTime.toFixed(1) }} hrs</p>
						</div>
					</div>
					<div v-if="!showRemarksInput"
						class="flex flex-col items-center justify-center space-y-2 text-center">
						<button @click="showRemarksInput = true"
							class="text-black-600 flex items-center gap-1 text-lg font-medium">
							<UIcon name="i-heroicons-plus" class="h-6 w-6" />
							Add Remarks (Optional)
						</button>
						<div class="flex items-center rounded-lg bg-blue-50 p-3 text-blue-800">
							<UIcon name="i-heroicons-information-circle"
								class="mr-2 flex-shrink-0 text-xl text-black" />
							<p class="text-xs text-black">To time out with less than 8 hours, please add a reason in the
								note field.</p>
						</div>
					</div>
					<div v-else class="flex w-full flex-col space-y-2">
						<h2 class="text-base font-semibold">Intern Notes:</h2>
						<UFormGroup name="intern_notes" class="w-full">
							<UTextarea v-model="intern_notes"
								placeholder="Add any details about your time log for today (e.g. overtime or short hours)."
								:rows="3" class="w-full" :ui="{ base: 'text-lg placeholder:text-lg w-full' }" />
						</UFormGroup>
					</div>
					<UButton @click="handleTimeOut" :disabled="isTimeOutDisabled" :loading="isSubmitting" block
						class="mt-4" size="lg">
						Time Out
					</UButton>
				</UCard>
			</div>

			<div v-else-if="lastCompletedLog">
				<h2 class="pb-4 text-xl font-semibold">Time Log Summary</h2>
				<UCard class="shadow-lg">
					<template #header>
						<div class="flex items-center justify-between">
							<div>
								<p class="text-black-500 text-sm">{{ formattedDate(lastCompletedLog.time_in) }}</p>
							</div>
							<UBadge v-if="lastCompletedLog.status === true" color="success" variant="soft">
								Approved
							</UBadge>
							<UBadge v-else color="warning" variant="soft">
								Pending Approval
							</UBadge>
						</div>
					</template>
					<div class="space-y-4">
						<div class="grid grid-cols-2 gap-4">
							<div>
								<p class="text-black-500 text-sm">Time in:</p>
								<p class="font-semibold">{{ formatTime(lastCompletedLog.time_in) }}</p>
							</div>
							<div>
								<p class="text-black-500 text-sm">Time out:</p>
								<p class="font-semibold">{{ formatTime(lastCompletedLog.time_out) }}</p>
							</div>
						</div>
						<div v-if="lastCompletedLog.intern_notes">
							<p class="text-black-500 text-sm">Intern Notes</p>
							<p class="rounded bg-gray-50 p-2 text-sm">{{ lastCompletedLog.intern_notes }}</p>
						</div>
						<div class="rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 p-4 text-center">
							<p class="text-black-500 text-sm">Total Hours:</p>
							<p class="text-xl font-bold">{{ lastCompletedLog.total_hours.toFixed(1) }} hrs</p>
						</div>
					</div>
				</UCard>
			</div>

			<div v-else>
				<UCard class="shadow-lg">
					<div class="text-center">
						<p class="mb-4">You do not have an active time log. Please log out and log in again to start a
							new time
							sheet.</p>
					</div>
				</UCard>
			</div>

			<div>
				<h2 class="pb-4 text-xl font-semibold">Hours Rendered</h2>
				<UCard class="shadow-lg">
					<div class="space-y-1 text-center">
						<p class="text-black-500 text-sm font-medium">{{ progressPercentage.toFixed(0) }}%</p>
						<UProgress v-model="renderedHours" :max="totalHours" color="success" />
						<p class="text-black-800 text-lg font-semibold">{{ renderedHours.toFixed(0) }} / {{ totalHours
							}} Hours</p>
					</div>
				</UCard>
			</div>
		</div>
		<LayoutBottomNav />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDashboard } from '~/composables/useDashboard'
import { formatTime, formattedDate } from '~/utils/formatters'

const renderedHours = ref(0)
const totalHours = ref(0)
const {
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
} = useDashboard(renderedHours, totalHours)
</script>

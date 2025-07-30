<script setup lang="ts">
	import { useRoute } from 'vue-router'
	import type { InternDetailsResponse, TimeLogForUI } from '~/types/composites'

	const route = useRoute()
	const internId = route.params.id

	const { data, pending, error, refresh } = await useFetch<InternDetailsResponse>(`/api/admin/approval/${internId}`)

	const isModalVisible = ref(false)
	const selectedLog = ref<TimeLogForUI | null>(null)
	const internFullName = computed(() => data.value?.intern.user.name || 'Loading...')
	const isApproving = ref(false)

	function openApprovalModal(log: TimeLogForUI) {
		selectedLog.value = log
		isModalVisible.value = true
	}

	async function handleApproveWithRemarks(payload: { id: string; remarks: string }) {
		if (isApproving.value) return
		isApproving.value = true

		try {
			await $fetch('/api/admin/approval/internlog', {
				method: 'POST',
				body: {
					logIds: [payload.id],
					remarks: payload.remarks,
				},
			})

			await refresh()

			isModalVisible.value = false
		} catch (err) {
			console.error('Failed to approve log:', err)
		} finally {
			isApproving.value = false
		}
	}
</script>

<template>
	<div>
		<div>
			<header class="flex items-center p-4">
				<NuxtLink
					to="/admin/active-interns"
					class="text-gray-600"
				>
					<svg
						class="h-6 w-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						></path>
					</svg>
				</NuxtLink>
				<h1 class="ml-4 text-xl font-bold text-gray-800">Manage Intern</h1>
			</header>

			<main class="p-4">
				<div
					v-if="pending"
					class="text-center text-gray-500"
				>
					Loading Intern Details...
				</div>

				<div
					v-else-if="error"
					class="text-center text-red-500"
				>
					<p>Could not load intern data.</p>
					<p class="text-sm">{{ error.statusMessage }}</p>
				</div>

				<div v-else-if="data">
					<div class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
						<div class="flex items-start space-x-4">
							<img
								:src="data.intern.user.avatar || '/default-avatar.png'"
								alt="Avatar"
								class="h-16 w-16 rounded-full bg-gray-200"
							/>
							<div class="flex-1">
								<p class="text-lg font-bold text-gray-900">{{ data.intern.user.name }}</p>
								<div class="flex items-center space-x-2 text-sm text-gray-600">
									<span>Ongoing</span>
									<span>-</span>
									<label class="flex cursor-pointer items-center">
										<input
											type="checkbox"
											class="peer sr-only"
										/>
										<div
											class="peer relative h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-500 peer-checked:after:translate-x-full peer-checked:after:border-white"
										></div>
										<span class="ml-2 text-sm font-medium text-gray-700">Mark as Completed</span>
									</label>
								</div>
								<p class="mt-1 text-sm text-gray-500">{{ data.intern.course }} - {{ data.intern.year }} Year</p>
								<p class="text-sm text-gray-500">{{ data.intern.school }}</p>
								<p class="mt-2 text-sm text-gray-500">
									Hours Completed: {{ data.intern.completed_hours }}/{{ data.intern.required_hours }}
								</p>
							</div>
						</div>
					</div>

					<!-- Tab Navigation -->
					<div class="mb-4 flex border-b">
						<button class="px-4 py-2 text-gray-500">Personal Info</button>
						<button class="border-b-2 border-teal-500 px-4 py-2 font-semibold text-teal-500">Time Logs</button>
					</div>

					<!-- Time Logs List -->
					<div class="space-y-4">
						<InternLogs
							v-for="log in data.timeLogs"
							:key="log.id"
							:log="log"
							:is-approving="isApproving"
							@open-modal="openApprovalModal"
						/>

						<!-- Export Button -->
						<button
							class="mt-4 flex w-full items-center justify-center rounded-lg border-2 border-teal-400 px-4 py-2 font-semibold text-teal-500"
						>
							<svg
								class="mr-2 h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 7.414V13a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
									clip-rule="evenodd"
								></path>
							</svg>
							Export DTR
						</button>
					</div>
				</div>
			</main>

			<ModalApproveLog
				v-model:modelValue="isModalVisible"
				:log="selectedLog"
				:intern-name="internFullName"
				@approve-with-remarks="handleApproveWithRemarks"
			/>
		</div>
	</div>
</template>

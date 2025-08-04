<script setup lang="ts">
	import { useRoute } from 'vue-router'
	import type { TabsItem } from '@nuxt/ui'
	import type { InternDetailsResponse, TimeLogForUI } from '~/types/composites'
	import { useApprovalModal } from '~/composables/use-approval-modal'

	const route = useRoute()
	const internId = route.params.id

	const items = [
		{
			label: 'Personal Info',
			slot: 'personalInfo' as const,
		},
		{
			label: 'Time Logs',
			slot: 'timeLogs' as const,
		},
	] satisfies TabsItem[]

	const { data, pending, error, refresh } = await useFetch<InternDetailsResponse>(`/api/admin/approval/${internId}`)

	const bus = useEventBus<string>('log:approved')
	bus.on(() => {
		refresh()
	})

	definePageMeta({
		layout: 'default',
	})
</script>

<template>
	<div>
		<UContainer>
			<header class="mb-4">
				<UButton
					to="/admin/interns"
					icon="i-lucide-arrow-left"
					color="neutral"
					variant="ghost"
					aria-label="Back"
				/>
			</header>

			<main class="p-4">
				<!-- Loading State -->
				<div v-if="pending">
					<UCard>
						<div class="flex items-center justify-between">
							<USkeleton class="h-8 w-48" />
							<USkeleton class="h-6 w-20 rounded-full" />
						</div>
						<div class="mt-4 space-y-3">
							<USkeleton
								v-for="i in 3"
								:key="i"
								class="h-20 w-full"
							/>
						</div>
					</UCard>
				</div>

				<!-- Error State -->
				<div v-else-if="error">
					<UAlert
						icon="i-lucide-alert-triangle"
						color="error"
						variant="subtle"
						title="Could not load data"
						:description="error.statusMessage || 'An unexpected error occurred.'"
					/>
				</div>

				<!-- Data Display -->
				<div v-else-if="data">
					<!-- Intern Details Card -->
					<UCard :ui="{ body: 'px-4 py-5 sm:p-6' }">
						<div class="flex items-start space-x-4">
							<UAvatar
								:src="data.intern.user.avatar || '/default-avatar.png'"
								alt="Avatar"
								size="xl"
							/>
							<div class="flex-1 space-y-1">
								<p class="text-xl font-bold text-gray-900 dark:text-white">{{ data.intern.user.name }}</p>
								<p class="text-gray-700 dark:text-gray-300">Ongoing - {{ 'UI/UX Designer' }}</p>
								<!-- data.intern.position || -->
								<p class="text-sm text-gray-500 dark:text-gray-400">
									{{ data.intern.course }} - {{ data.intern.year }} Year | {{ data.intern.school }}
								</p>
								<p class="pt-1 text-sm text-gray-500 dark:text-gray-400">
									Hours Completed: {{ data.intern.completed_hours }}/{{ data.intern.required_hours }}
								</p>
							</div>
						</div>
					</UCard>

					<!-- Tab Navigation -->

					<UTabs
						:items="items"
						variant="link"
						:ui="{ trigger: 'grow' }"
						color="neutral"
						class="w-full gap-4"
						size="md"
					>
						<template #personalInfo>
							<p class="text-muted mb-4">PERSONAL INFO OF INTERNS GOES HERE</p>
						</template>

						<template #timeLogs>
							<!-- <div
								v-if="pending"
								class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
							>
								<USkeleton
									v-for="i in 3"
									:key="i"
									class="h-60 w-full"
								/>
							</div> -->

							<div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
								<InternLogs
									v-for="log in data.timeLogs"
									:key="log.id"
									:log="log"
								/>
							</div>

							<UButton
								label="Export DTR"
								icon="i-lucide-download"
								color="primary"
								variant="solid"
								size="lg"
								block
								class="mt-4"
							/>
						</template>
					</UTabs>
				</div>
			</main>
		</UContainer>
	</div>
</template>

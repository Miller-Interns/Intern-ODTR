<!-- temporary only -->

<template>
	<UContainer>
		<header class="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="flex h-16 items-center justify-between">
					<div class="flex items-center">
						<UButton
							icon="i-lucide-corner-up-left"
							color="secondary"
							variant="ghost"
							aria-label="Go back"
							@click="goBack"
						/>
						<h1 class="ml-4 text-lg font-bold text-gray-900 dark:text-white">Active Interns</h1>
					</div>
				</div>
			</div>
		</header>

		<main class="p-4">
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

			<div v-else-if="error">
				<UAlert
					icon="i-lucide-alert-triangle"
					color="error"
					variant="subtle"
					title="Could not load data"
					:description="error.statusMessage || 'An unexpected error occurred.'"
				/>
			</div>

			<div v-else-if="data">
				<UCard>
					<template #header>
						<div class="flex items-center justify-between">
							<h2 class="text-base font-normal text-gray-900 dark:text-white">
								Batch Details
								<UBadge
									color="primary"
									variant="solid"
									class="font-base rounded-full"
								>
									{{ batchStatus.text }}
								</UBadge>
							</h2>
						</div>
					</template>

					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<NuxtLink
							v-for="intern in data.interns"
							:key="intern.id"
							:to="`/admin/interns/${intern.id}`"
							class="block"
						>
							<InternCard :intern="intern" />
						</NuxtLink>
					</div>

					<template #footer>
						<UButton
							icon="i-lucide-plus"
							label="Add Intern"
							color="primary"
							variant="outline"
							block
						/>
					</template>
				</UCard>
			</div>
		</main>
	</UContainer>
</template>

<script setup lang="ts">
	import type { ActiveInternsResponse } from '~/types/Api'
	const { data, pending, error } = await useFetch<ActiveInternsResponse>(`/api/interns/active-interns`)

	const batchStatus = computed(() => {
		if (!data.value) {
			return {
				text: 'Loading...',
			}
		}
		if (data.value.batch?.status) {
			return {
				text: 'Ongoing',
			}
		} else {
			return {
				text: 'Completed',
			}
		}
	})

	const router = useRouter()
	const goBack = () => {
		router.back()
	}

	definePageMeta({
		layout: 'admin',
	})
</script>

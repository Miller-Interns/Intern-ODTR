<template>
	<div class="flex items-center gap-4 sm:gap-6">
		<div class="relative flex-shrink-0">
			<UAvatar
				:src="avatarUrl || ''"
				:alt="intern.user.name ?? 'Intern'"
				size="3xl"
			/>
		</div>

		<div class="w-full space-y-2">
			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 class="text-2xl font-bold text-black dark:text-white">{{ intern.user.name }}</h1>
					<span>
						<UBadge
							class="font-base rounded-full"
							color="success"
							variant="soft"
							size="md"
						>
							{{ intern.status }}
						</UBadge>
					</span>
					<p class="text-sm text-gray-500 dark:text-gray-400">{{ intern.role }}</p>
					<p class="text-sm text-gray-500 dark:text-gray-400">{{ intern.course }} - {{ intern.year }} | {{ intern.school }}</p>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Hours Completed: {{ intern.completed_hours }} / {{ intern.required_hours }} Hours
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { InternWithDetails } from '~/types/Intern'

	const { intern } = defineProps<{
		intern: InternWithDetails
	}>()

	const avatarUrl = computed(() => {
		if (intern.intern_picture) {
			return `/uploads/avatars/${intern.intern_picture}`
		}
		return null
	})
</script>

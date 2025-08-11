<script setup lang="ts">
	import type { InternSummary } from '~/interfaces/interns'

	const { intern } = defineProps<{
		intern: InternSummary
	}>()

	const avatarUrl = computed(() => {
		if (intern.intern_picture) {
			return `/uploads/avatars/${intern.intern_picture}`
		}
		return null
	})
</script>

<template>
	<UCard :ui="{ body: 'p-3 sm:p-3' }">
		<div class="flex items-center space-x-3">
			<UAvatar
				:src="avatarUrl || ''"
				alt="intern.user.name ?? 'Intern'"
				size="3xl"
			/>
			<div class="flex-1">
				<p class="font-semibold text-gray-800 dark:text-gray-100">{{ intern.user.name }}</p>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					Hours Completed: {{ intern.completed_hours }}/{{ intern.required_hours }} hours
				</p>
			</div>
		</div>
	</UCard>
</template>

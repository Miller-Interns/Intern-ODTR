<script setup lang="ts">
	import type { PropType } from 'vue'
	import type { InternWithDetails } from '../types/composites.js'

	defineProps({
		intern: {
			type: Object as PropType<InternWithDetails>,
			required: true,
		},
	})
</script>

<template>
	<UCard :ui="{ body: 'p-3 sm:p-3' }">
		<div class="flex items-center space-x-3">
			<UAvatar
				:src="intern.user.avatar || ''"
				alt="Intern Avatar"
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

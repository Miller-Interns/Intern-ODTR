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
	<div class="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
		<div class="flex items-center space-x-3">
			<img
				:src="intern.user.avatar || '/default-avatar.png'"
				alt="Intern Avatar"
				class="h-12 w-12 rounded-full bg-gray-200"
			/>
			<div class="flex-1">
				<p class="font-semibold text-gray-800">{{ intern.user.name }}</p>
				<p class="text-sm text-gray-500">Hours Completed: {{ intern.completed_hours }}/{{ intern.required_hours }} hours</p>
			</div>
		</div>
	</div>
</template>

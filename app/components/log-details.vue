<script setup lang="ts">
	defineProps<{
		timeIn: string
		timeOut: string
		totalHours: string
	}>()
</script>

<template>
	<div class="grid grid-cols-3 text-center">
		<div>
			<p class="text-sm text-gray-500">Time in</p>
			<p class="font-medium">{{ timeIn }}</p>
		</div>
		<div>
			<p class="text-sm text-gray-500">Time out</p>
			<p class="font-medium">{{ timeOut }}</p>
		</div>
		<div>
			<p class="text-sm text-gray-500">Total Hours</p>
			<p class="font-medium">{{ totalHours }}</p>
		</div>
	</div>
</template>

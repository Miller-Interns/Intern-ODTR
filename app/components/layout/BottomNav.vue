<template>
	<footer class="fixed right-0 bottom-0 left-0 border-t bg-white shadow-inner">
		<div class="flex justify-around py-2">
			<!-- We loop through our navigation links to create the buttons -->
			<UButton
				v-for="link in navLinks"
				:key="link.to"
				:to="link.to"
				variant="link"
				:icon="link.icon"
				:class="getLinkClass(link.to)"
				class="flex flex-col items-center text-xs"
			>
				{{ link.label }}
			</UButton>
		</div>
	</footer>
</template>

<script setup lang="ts">
	import { useRoute } from 'vue-router'

	// Get the current route to determine which link is active
	const route = useRoute()

	// Define the navigation links in an array for easy management
	const navLinks = [
		{ to: '/intern/dashboard', icon: 'i-heroicons-home', label: 'Dashboard' },
		{ to: '/intern/timelogs', icon: 'i-heroicons-clock', label: 'Time Logs' },
		{ to: '/intern/profile', icon: 'i-heroicons-user-circle', label: 'Profile' },
	]

	// This function checks if the link's path matches the current route's path
	// and applies a different style if it's active.
	const getLinkClass = (path: string) => {
		return route.path === path
			? 'text-primary-600 font-bold' // Style for the active link
			: 'text-gray-600' // Style for inactive links
	}
</script>

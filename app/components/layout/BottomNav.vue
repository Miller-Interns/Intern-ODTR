<template>
<footer class="fixed right-0 bottom-0 left-0 border-t light:bg-white dark:bg-black shadow-inner">
		<div class="flex justify-around py-2">
			<UButton v-for="link in navLinks" :key="link.to" :to="link.to" variant="link" :icon="link.icon"
				:class="getLinkClass(link.to)" class="flex flex-col items-center text-md">
				{{ link.label }}
			</UButton>
		</div>
	</footer>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const navLinks = [
	{ to: '/intern/dashboard', icon: 'si:home-line', label: 'Dashboard' },
	{ to: '/intern/timelogs', icon: 'mdi:folder-clock-outline', label: 'Time Logs' },
	{ to: '/intern/profile', icon: 'i-heroicons-user-circle', label: 'Profile' },
]
const getLinkClass = (path: string) => {
	return route.path === path
		? 'text-primary-600 font-bold'
		: 'text-gray-600'
}
</script>

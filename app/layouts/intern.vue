<template>
	<main
		class="px-safe min-h-screen bg-gray-50 dark:bg-gray-900 pb-[calc(theme(spacing.20)+env(safe-area-inset-bottom))]"
	>
		<slot />
	</main>

	<footer class="fixed bottom-0 left-0 w-full border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 z-50">
		<nav class="px-safe mx-auto flex max-w-md justify-around">
			<NuxtLink
				v-for="link in navLinks"
				:key="link.label"
				:to="link.to"
				class="group flex flex-1 flex-col items-center gap-1 py-2 text-center"
			>
				<UIcon
					:name="link.icon"
					class="h-6 w-6 transition-colors duration-200"
					:class="[ isLinkActive(link) ? 'text-primary' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' ]"
				/>
				<span
					class="text-xs transition-colors duration-200"
					:class="[ isLinkActive(link) ? 'text-primary font-bold' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' ]"
				>
					{{ link.label }}
				</span>
			</NuxtLink>
		</nav>
	</footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const route = useRoute();

const navLinks = [
	{ label: 'Dashboard', icon: 'i-lucide-home', to: '/intern/dashboard' },
	{ label: 'Time Logs', icon: 'i-lucide-file-clock', to: '/intern/timelogs' },
	{ label: 'Profile', icon: 'i-lucide-user-circle', to: '/intern/profile' },
];

function isLinkActive(link: { to: string }): boolean {
  if (link.to === '/intern/dashboard') {
    return route.path === link.to;
  }
  return route.path.startsWith(link.to);
}
</script>
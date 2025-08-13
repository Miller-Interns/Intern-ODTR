<template>
	<main
		class="px-safe min-h-screen bg-gray-50 pt-[calc(theme(spacing.8)+env(safe-area-inset-top))] pb-[calc(theme(spacing.24)+env(safe-area-inset-bottom))] font-sans dark:bg-gray-900"
	>
		<slot />
	</main>

	<footer class="fixed bottom-0 left-0 w-full border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
		<nav class="px-safe mx-auto flex max-w-4xl justify-around">
			<NuxtLink
				v-for="link in links"
				:key="link.to"
				:to="link.to"
				class="group flex flex-1 flex-col items-center gap-1 py-2 text-center"
				:class="{ 'router-link-active': route.path.startsWith(link.to) }"
			>
				<UIcon
					:name="link.icon"
					class="h-6 w-6"
					:class="[
						route.path.startsWith(link.to) ? 'text-neutral' : 'group-hover:text-neutral text-gray-600 transition-colors dark:text-gray-400',
					]"
				/>
				<span
					class="text-sm"
					:class="[
						route.path.startsWith(link.to)
							? 'text-neutral font-bold'
							: 'group-hover:text-neutral text-gray-600 transition-colors dark:text-gray-400',
					]"
				>
					{{ link.label }}
				</span>
			</NuxtLink>
		</nav>
	</footer>
</template>

<script setup lang="ts">
	const route = useRoute()
	const links = [
		{
			label: 'Dashboard',
			icon: 'i-lucide-house',
			to: '/admin/dashboard',
		},
		{
			label: 'Manage',
			icon: 'i-lucide-users-round',
			to: '/admin/manage',
		},
		{
			label: 'Active Interns',
			icon: 'i-lucide-user-round-check',
			to: '/admin/interns',
		},
		{
			label: 'Profile',
			icon: 'i-lucide-circle-user',
			to: '/admin/profile',
		},
	]
</script>

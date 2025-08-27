<template>
	<main
		class="px-safe min-h-screen bg-gray-50 pt-[calc(theme(spacing.8)+env(safe-area-inset-top))] pb-[calc(theme(spacing.24)+env(safe-area-inset-bottom))] font-sans dark:bg-gray-900"
	>
		<slot />
	</main>
	<footer class="fixed bottom-0 left-0 w-full border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
		<nav class="px-safe mx-auto flex max-w-4xl justify-around">
			<NuxtLink
				v-for="link in dynamicLinks"
				:key="link.label"
				:to="link.to"
				class="group flex flex-1 flex-col items-center gap-1 py-2 text-center"
				:class="{ 'router-link-active': isLinkActive(link) }"
			>
				<UIcon
					:name="link.icon"
					class="h-6 w-6"
					:class="[ isLinkActive(link) ? 'text-neutral' : 'text-gray-600 group-hover:text-neutral' ]"
				/>
				<span
					class="text-sm"
					:class="[ isLinkActive(link) ? 'text-neutral font-bold' : 'text-gray-600 group-hover:text-neutral' ]"
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

type BatchForLayout = {
  id: string;
  status: 'INCOMING' | 'ONGOING' | 'COMPLETED';
};

const { data: allBatches } = useFetch<BatchForLayout[]>('/api/batches', {
	key: 'layout-batch-list',
});

const ongoingBatch = computed(() => {
	if (!allBatches.value) return null;
	return allBatches.value.find(batch => batch.status === 'ONGOING');
});

const dynamicLinks = computed(() => {
	const activeBatchUrl = ongoingBatch.value
		? `/admin/batches/${ongoingBatch.value.id}`
		: '/admin/batches';

	return [
		{ label: 'Dashboard', icon: 'i-lucide-house', to: '/admin/dashboard' },
		{ label: 'Manage', icon: 'i-lucide-users-round', to: '/admin/batches' },
		{ label: 'Active Batch', icon: 'i-lucide-user-round-check', to: activeBatchUrl },
		{ label: 'Logout', icon: 'i-lucide-circle-user', to: '/admin/logout' },
	];
});

function isLinkActive(link: { label: string; to: string }): boolean {
	if (link.label === 'Active Batch') {
		return ongoingBatch.value ? route.path === `/admin/batches/${ongoingBatch.value.id}` : false;
	}

	if (link.label === 'Manage') {
		if (ongoingBatch.value && route.path === `/admin/batches/${ongoingBatch.value.id}`) {
			return false;
		}
		return route.path.startsWith('/admin/batches');
	}

	return route.path.startsWith(link.to);
}
</script>
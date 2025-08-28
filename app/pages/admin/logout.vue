<template>
	<div class="p-4 sm:p-6">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Profile</h1>

		<div v-if="user" class="flex flex-col items-center w-full max-w-sm md:max-w-md mx-auto">
			<UCard class="shadow-md w-full">
				<div class="flex items-center gap-4">
					<UAvatar :alt="(user as any).name" size="lg" />
					<div>
						<p class="font-bold text-lg text-gray-900 dark:text-white">{{ (user as any).name }}</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">Admin Position: {{ (user as any).position || 'Supervisor' }}</p>
					</div>
				</div>
			</UCard>

			<!-- Logout button -->
			<div class="w-full mt-6">
				<UButton 
					@click="isLogoutModalOpen = true" 
					block 
					size="lg" 
					icon="i-lucide-log-out"
					color="primary" 
					class="text-md text-white"
				>
					Logout
				</UButton>
			</div>
		</div>
		<UModal v-model:open="isLogoutModalOpen" title="Confirmation">
			<template #header>
				<h2 class="text-2xl font-bold">Logout?</h2>
			</template>
			<template #body>
				<p class="py-4 light:text-black">Are you sure you want to log out?</p>
			</template>
			<template #footer>
				<div class="flex justify-end gap-2">
					<UButton @click="isLogoutModalOpen = false" color="primary" variant="outline" label="Cancel"
						class="text-md light:text-black" />
					<UButton @click="performLogout" color="primary" label="Yes, Logout" class="text-md text-white" />
				</div>
			</template>
		</UModal>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const { clear, user } = useUserSession()
const router = useRouter()
const isLogoutModalOpen = ref(false)

async function performLogout() {
	isLogoutModalOpen.value = false
	await $fetch('/api/auth/logout', { method: 'POST' })
	await clear()
	await router.push('/login')
}

definePageMeta({
	layout: 'admin',
})
</script>
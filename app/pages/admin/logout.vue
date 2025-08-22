<template>
	<h1 class="text-2xl font-bold text-black-800 pl-5 pb-10">Admin Logout</h1>

	<div class="flex flex-col items-center">
		<UCard class="shadow-lg w-80 items-center">
			<h1 class="text-md font-bold text-left">Admin Name:</h1>
			<h1 class="text-3xl font-bold text-center pt-3 pb-3">{{ user.name }}</h1>
		</UCard>

		<!-- Logout button just below card, no scrolling needed -->
		<div class="w-full px-5 mt-120">
			<UButton @click="isLogoutModalOpen = true" block size="lg" icon="i-heroicons-arrow-left-on-rectangle"
				color="primary" class="text-md text-white">
				Logout
			</UButton>
		</div>
	</div>

	<!-- Logout Modal -->
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

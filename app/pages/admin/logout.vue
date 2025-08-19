<template>
	<h1 class="text-2xl font-bold text-black-800 pl-5 pb-10">Admin Logout</h1>
	<div class="flex min-h-screen flex-col items-center">
			<UCard class="shadow-lg w-80 items-center">
				<h1 class="text-md font-bold text-left">Admin Name:</h1>
				<h1 class="text-3xl font-bold text-center pt-3">{{ user.name }}</h1>
			</UCard>
		<footer>
			<UModal v-model:open="isLogoutModalOpen" title="Confirmation">
				<UButton @click="isLogoutModalOpen = true" block size="lg" icon="i-heroicons-arrow-left-on-rectangle"
					color="primary">
					Logout
				</UButton>
				<template #header>
					<h2 class="text-2xl font-bold">Logout?</h2>
				</template>
				<template #body>
					<p class="py-4 text-black">Are you sure you want to log out?</p>
				</template>
				<template #footer>
					<div class="flex justify-end gap-2">
						<UButton @click="isLogoutModalOpen = false" color="primary" variant="outline" label="Cancel"
							class="text-md text-black" />
						<UButton @click="performLogout" color="primary" label="Yes, Logout"
							class="text-md text-white" />
					</div>
				</template>
			</UModal>
		</footer>
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

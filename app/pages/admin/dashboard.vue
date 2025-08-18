<template>
	<div class="flex min-h-screen flex-col bg-gray-100">
		<!-- Header -->
		<header class="bg-white p-4 shadow-sm">
			<h1 class="text-xl font-bold text-gray-800">Admin Dashboard</h1>
		</header>

		<!-- Main Content -->
		<main class="flex-1 p-6">
			<div class="rounded-lg bg-white p-6 shadow">
				<h2 class="text-lg font-semibold">Welcome, Admin!</h2>
				<p class="mt-2 text-gray-600">
					This is the main dashboard for administrators. From here, you can manage interns and their time logs.
				</p>
			</div>
		</main>

		<!-- Logout Confirmation Modal -->
		<UModal
			v-model:open="isLogoutModalOpen"
			title="Confirmation"
		>
			<UButton
				@click="isLogoutModalOpen = true"
				block
				size="lg"
				icon="i-heroicons-arrow-left-on-rectangle"
				color="primary"
			>
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
					<UButton
						@click="isLogoutModalOpen = false"
						color="primary"
						variant="outline"
						label="Cancel"
						class="text-md text-black"
					/>
					<UButton
						@click="performLogout"
						color="primary"
						label="Yes, Logout"
						class="text-md text-white"
					/>
				</div>
			</template>
		</UModal>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue'

	const { clear } = useUserSession()
	const router = useRouter()

	const isLogoutModalOpen = ref(false)

	// This function contains the logic to log the user out.
	async function performLogout() {
		isLogoutModalOpen.value = false
		await $fetch('/api/auth/logout', { method: 'POST' })
		await clear()
		await router.push('/login')
	}
</script>

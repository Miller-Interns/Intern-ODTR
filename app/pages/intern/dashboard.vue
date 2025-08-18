<template>
	<div
		v-if="user"
		class="dashboard-container"
	>
		<h1>Dashboard</h1>
		<p>Welcome, hello!</p>
		<p>This page is for intern</p>
		<button
			@click="handleLogout"
			class="submit-button"
		>
			Log Out
		</button>
	</div>
</template>

<script setup lang="ts">
	import { RouterNames } from '~/types/RouterNames'
	import type { User } from '~/types/User'

	const { user, fetch, clear } = useUserSession()
	// const user = ref<User | null>(null)

	onMounted(() => {
		fetch()
	})

	const handleLogout = async () => {
		try {
			const response = await $fetch<{ status: boolean }>('/api/auth/logout', { method: 'POST' })
			if (response.status) {
				await clear()
				navigateTo({ name: RouterNames.LOGIN }, { replace: true })
			} else {
				console.error('Logout failed: No response from server')
			}
		} catch (error) {
			console.error('Logout failed:', error)
		}
	}
</script>

<style scoped>
	.dashboard-container {
		padding: 2rem;
		font-family: sans-serif;
		text-align: center;
	}

	.submit-button {
		display: inline-block;
		width: auto;
		padding: 10px 20px;
		font-size: 1rem;
		font-weight: 600;
		color: #ffffff;
		background-color: #ef4444;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: background-color 0.2s;
		margin-top: 24px;
	}

	.submit-button:hover {
		background-color: #dc2626;
	}
</style>

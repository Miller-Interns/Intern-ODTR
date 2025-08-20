<template>
	<div class="flex min-h-screen items-center justify-center bg-white p-4 dark:bg-gray-900">
		<UCard class="w-full max-w-sm !divide-y-0 !border-none !shadow-none !ring-0">
			<template #header>
				<div class="space-y-4 text-center">
					<div class="flex justify-center">
						<img :src="Logo" alt="App Logo" class="h-16 w-16" />
					</div>
					<h1 class="text-lg font-bold text-gray-900 dark:text-white">Welcome to MllrDev Intern DTR</h1>
					<p class="text-sm font-normal text-gray-500 dark:text-gray-400">Log in with your Miller Development
						account to continue</p>
				</div>
			</template>
			<UForm :validate="validate" :state="state" class="space-y-4" @submit="handleLogin">
				<UFormField name="email" label="Email:" required>
					<UInput v-model="state.email" placeholder="username@gmail.com"
						class="w-full rounded-md border text-sm italic placeholder-gray-400" :class="emailError
							? 'border-red-500 focus:border-red-500 focus:ring-red-500'
							: 'focus:border-primary-500 focus:ring-primary-500 border-gray-300'
							" />
				</UFormField>
				<p v-if="emailError" class="mt-1 text-sm text-red-500">
					Please Enter a Valid Email Address
				</p>
				<UFormField name="password" label="Password:" required>
					<UInput v-model="state.password" :type="isPasswordVisible ? 'text' : 'password'" revealable="false"
						placeholder="Password" class="w-full rounded-md border text-sm italic placeholder-gray-400"
						:class="passwordError
							? 'border-red-500 focus:border-red-500 focus:ring-red-500'
							: 'focus:border-primary-500 focus:ring-primary-500 border-gray-300'
							">
						<template #trailing>
							<UButton :icon="isPasswordVisible ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
								variant="link" color="neutral" :padded="false"
								@click="isPasswordVisible = !isPasswordVisible" />
						</template>
					</UInput>
				</UFormField>
				<p v-if="passwordError" class="mt-1 text-sm text-red-500">
					{{ passwordError }}
				</p>
				<UButton type="submit" label="Sign in" :loading="isLoading" block
					class="bg-primary-500 rounded-md py-2 text-base text-white" />
			</UForm>
		</UCard>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormError, FormSubmitEvent } from '#ui/types'
import { UForm, UFormField, UInput, UCard, UButton } from '#components'
import Logo from '../assets/images/logo-cadet-blue.svg'

const isLoading = ref(false)
const isPasswordVisible = ref(false)
const emailError = ref(false)
const passwordError = ref<string | undefined>(undefined)
const { fetch, user } = useUserSession()

const state = reactive({
	email: undefined,
	password: undefined,
})

const validate = (state: any): FormError[] => {
	const errors = []
	if (!state.email) errors.push({ name: 'email', message: 'Required' })
	if (!state.password) errors.push({ name: 'password', message: 'Required' })
	return errors
}

const handleLogin = async (event: FormSubmitEvent<any>) => {
	isLoading.value = true
	emailError.value = false
	passwordError.value = undefined

	try {
		const response = await $fetch<{ status: string; message: string }>('/api/auth/login/', {
			method: 'POST',
			body: {
				email: event.data.email,
				password: event.data.password,
			},
		})

		if (response) {
			await fetch()
			if (user.value?.isAdmin) { navigateTo({ name: 'admin-dashboard' }, { replace: true }) } 
			else { navigateTo({ name: 'intern-dashboard' }, { replace: true }) }
		}
	} catch (error: any) {
		emailError.value = true
		passwordError.value = error.data?.statusMessage || 'Incorrect Password'
	} finally {
		isLoading.value = false
	}
}
</script>
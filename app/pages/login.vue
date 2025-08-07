<template>
  <div class="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 p-4">
    <UCard class="w-full max-w-sm !border-none !shadow-none !ring-0 !divide-y-0">
      <template #header>
        <div class="text-center space-y-4">
          <div class="flex justify-center">
            <img :src="Logo" alt="App Logo" class="w-16 h-16" />
          </div>
          <h1 class="text-lg font-bold text-gray-900 dark:text-white">
            Welcome to MllrDev Intern DTR
          </h1>
          <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
            Log in with your Miller Development account to continue
          </p>
        </div>
      </template>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleLogin">
        <UFormField name="email" label="Email:" required>
          <UInput v-model="state.email" placeholder="username@gmail.com"
            class="w-full rounded-md border text-sm italic placeholder-gray-400"
            :class="emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'" />
        </UFormField>
        <p v-if="emailError" class="text-sm text-red-500 mt-1">
          Please Enter a Valid Email Address
        </p>
        <UFormField name="password" label="Password:" required>
          <UInput v-model="state.password" :type="isPasswordVisible ? 'text' : 'password'" revealable="false"
            placeholder="Password" class="w-full rounded-md border text-sm italic placeholder-gray-400"
            :class="passwordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'">
            <template #trailing>
              <UButton :icon="isPasswordVisible ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" variant="link"
                color="neutral" :padded="false" @click="isPasswordVisible = !isPasswordVisible" />
            </template>
          </UInput>
        </UFormField>
        <p v-if="passwordError" class="text-sm text-red-500 mt-1">
          {{ passwordError }}
        </p>
        <UButton type="submit" label="Sign in" :loading="isLoading" block
          class="bg-primary-500 text-white text-base py-2 rounded-md" />
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormSubmitEvent } from '#ui/types'
import { UForm, UFormField, UInput, UCard, UButton } from '#components'
import Logo from '../assets/images/logo-cadet-blue.svg'
import { loginSchema, type LoginSchema } from '~/server/use-cases/useAuth.schema'
import { RouterNames } from '~/types/RouterNames';

definePageMeta({ middleware: 'guest' })

const { fetchUser } = useAuth()

const isLoading = ref(false)
const isPasswordVisible = ref(false)
const emailError = ref(false)
const passwordError = ref<string | undefined>(undefined)

const schema = loginSchema
type Schema = LoginSchema

const state = reactive({
  email: '',
  password: '',
})

const handleLogin = async (event: FormSubmitEvent<Schema>) => {
  isLoading.value = true
  emailError.value = false
  passwordError.value = undefined

  try {
    await $fetch('/api/login', {
      method: 'POST',
      body: {
        email: event.data.email,
        password: event.data.password,
      },
    })

    await fetchUser()
    await navigateTo({ name: RouterNames.DASHBOARD }, { replace: true });
  } catch (error: any) {
    emailError.value = true
    passwordError.value = error.data?.statusMessage || 'Incorrect Password'
  } finally {
    isLoading.value = false
  }
}
</script>

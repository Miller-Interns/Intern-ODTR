<template>
  <!-- Main container using Flexbox for centering -->
  <div class="flex items-start justify-center min-h-screen bg-gray-500 dark:bg-gray-900 p-4 pt-[10vh]">
    <UCard class="w-full max-w-sm">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome to MllrDev Intern DTR
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Log in with your account to continue
          </p>
        </div>
      </template>

      <!-- UForm handles validation, state, and submission -->
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleLogin">
        <UFormGroup label="Email" name="email">
          <UInput
            v-model="state.email"
            icon="i-heroicons-at-symbol"
            placeholder="username@gmail.com"
            autocomplete="email"
            size="lg"
          />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput
            v-model="state.password"
            :type="isPasswordVisible ? 'text' : 'password'"
            placeholder="Password"
            autocomplete="current-password"
            size="lg"
          >
            <!-- Slot for the show/hide password toggle -->
            <template #trailing>
              <UButton
                :icon="isPasswordVisible ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                variant="link"
                color="primary"
                :padded="false"
                @click="isPasswordVisible = !isPasswordVisible"
              />
            </template>
          </UInput>
        </UFormGroup>

        <UButton
          type="submit"
          label="Sign In"
          color="primary"
          size="lg"
          :loading="isLoading"
          block
        />
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

definePageMeta({
  middleware: 'guest',
});

const { fetchUser } = useAuth();
const isLoading = ref(false);
const isPasswordVisible = ref(false);

// 1. Define the validation schema with Zod
const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Type definition for the form state, inferred from the schema
type Schema = z.output<typeof schema>

// 2. Create a reactive state object for the form
const state = reactive({
  email: '',
  password: '',
});

// 3. The handleLogin function now receives a typed event from UForm
const handleLogin = async (event: FormSubmitEvent<Schema>) => {
  isLoading.value = true;
  // The 'event.data' is the validated form state
  const { email, password } = event.data;

  try {
    await $fetch('/api/login', {
      method: 'POST',
      body: { email, password },
    });
    
    await fetchUser();
    await navigateTo('/dashboard');

  } catch (error: any) {
    console.error('Login failed. Server response:', error.data);
    const message = error.data?.statusMessage || 'An unknown error occurred.';
    
    // UForm can programmatically set errors. We need access to the form instance.
    // However, a simpler approach for a login form is to display a general toast notification.
    // For this example, we'll stick to a simple alert or console log for the error.
    // A more advanced pattern would involve using `useToast()` from Nuxt UI.
    const toast = useToast()
    toast.add({
      title: 'Login Failed',
      description: message.includes('password') || message.includes('credentials')
        ? 'Incorrect email or password.'
        : 'An unexpected error occurred. Please try again.',
      color: 'secondary',
      icon: 'i-heroicons-exclamation-circle',
    })

  } finally {
    isLoading.value = false;
  }
};
</script>
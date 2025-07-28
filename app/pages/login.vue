<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-placeholder"></div>
      <div class="card-header">
        <h1>Welcome to MllrDev Intern DTR</h1>
        <p>Log in with your Miller Development account to continue</p>
      </div>
      <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email:</label>
          <input id="email" v-model="email" name="email" type="email" autocomplete="email" required class="form-input"
            placeholder="Enter Email">
        </div>
        <div class="input-group">
          <label for="password">Password:</label>
          <input id="password" v-model="password" name="password" type="password" autocomplete="current-password"
            required class="form-input" placeholder="Enter Password">
        </div>
        <div class="form-group">
          <button type="submit" class="submit-button" :disabled="isLoading">
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </div>
      </form>
      <button class="submit-button" :disabled="isLoading" @click="navigateTo('/register');">
        Register
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  middleware: 'guest',
});

const { fetchUser } = useAuth();
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMsg = ref<string | null>(null);

const handleLogin = async () => {
  isLoading.value = true;
  errorMsg.value = null;
  try {
    await $fetch('/api/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    });
    await fetchUser();
    await navigateTo('/dashboard');
  } catch (error: any) {
    console.error('Login failed. Server response:', error.data);
    errorMsg.value = error.data?.statusMessage || 'An unknown error occurred.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #4B5563;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.login-card {
  width: 90%;
  max-width: 400px;
  padding: 40px 30px;
  background-color: #ffffff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.logo-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #E5E7EB;
  margin-bottom: 24px;
}

.card-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.card-header p {
  margin-top: 8px;
  color: #6B7280;
  font-size: 0.9rem;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
}

.input-group {
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  padding: 0 12px;
  background-color: #fff;
  transition: border-color 0.2s;
}

.input-group:focus-within {
  border-color: #4F46E5;
}

.icon {
  color: #6B7280;
  flex-shrink: 0;
}

.input-group label {
  font-weight: 500;
  color: #374151;
  margin: 0 8px;
  white-space: nowrap;
}

.form-input {
  flex-grow: 1;
  border: none;
  outline: none;
  background-color: transparent;
  padding: 14px 0;
  font-size: 1rem;
  width: 100%;
}

.form-input::placeholder {
  color: #9CA3AF;
}

.toggle-password {
  background: none;
  border: none;
  padding: 0;
  margin-left: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #6B7280;
}

.submit-button {
  width: 100%;
  padding: 14px 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #1F2937;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  margin-top: 8px;
}

.submit-button:hover {
  background-color: #111827;
}

.form-group {
  width: 100%;
}
</style>
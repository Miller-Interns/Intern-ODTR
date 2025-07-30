<template>
  <div class="login-container">
    <div class="content-wrapper">
      <div class="card-header">
        <h1>Welcome to MllrDev Intern DTR</h1>
        <p>Log in with your Miller Development account to continue</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin" novalidate>
        <div class="input-group">
          <label for="email">Email:*</label>
          <div class="input-wrapper">
            <input id="email" v-model="email" name="email" type="email" autocomplete="email" required class="form-input"
              :class="{ 'is-invalid': emailError }" placeholder="username@gmail.com">
          </div>
          <p v-if="emailError" class="error-message">{{ emailError }}</p>
        </div>

        <div class="input-group">
          <label for="password">Password:*</label>
          <div class="input-wrapper">
            <input id="password" v-model="password" name="password" :type="isPasswordVisible ? 'text' : 'password'"
              autocomplete="current-password" required class="form-input" :class="{ 'is-invalid': passwordError }"
              placeholder="Password">
            <button type="button" @click="togglePasswordVisibility" class="toggle-password">0
            </button>
          </div>
          <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
        </div>

        <button type="submit" class="submit-button" :disabled="isLoading">
          {{ isLoading ? 'Signing In...' : 'Sign in' }}
        </button>
      </form>
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

const emailError = ref<string | null>(null);
const passwordError = ref<string | null>(null);

const isPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handleLogin = async () => {
  emailError.value = null;
  passwordError.value = null;

  if (!email.value || !isValidEmail(email.value)) {
    emailError.value = 'Please Enter a Valid Email Address';
  }
  if (!password.value) {
    passwordError.value = 'Password is required';
  }

  if (emailError.value || passwordError.value) {
    return;
  }

  isLoading.value = true;
  try {
    await $fetch('/api/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    });
    await fetchUser();
    await navigateTo('/dashboard');
  } catch (error: any) {
    console.error('Login failed. Server response:', error.data);
    const message = error.data?.statusMessage || 'An unknown error occurred.';

    if (message.toLowerCase().includes('password')) {
      passwordError.value = 'Incorrect Password';
    } else if (message.toLowerCase().includes('email') || message.toLowerCase().includes('user')) {
      emailError.value = 'Please Enter a Valid Email Address';
    } else {
      passwordError.value = 'Incorrect Password';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background-color: #4B5563;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  overflow-y: auto;
}

.content-wrapper {
  width: 100%;
  max-width: 420px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px;
  margin-top: 10vh;
  border-radius: 8px;
}

.logo {
  margin-bottom: 24px;
}

.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.card-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.card-header p {
  font-size: 0.9rem;
  color: #6B7280;
  margin: 0;
  max-width: 320px;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  width: 100%; /* FIX: Changed from 380px to 100% to fit container */
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.form-input {
  width: 100%;
  box-sizing: border-box; /* Ensures padding is included in the width */
  padding: 12px 16px;
  font-size: 1rem;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  background-color: #FFFFFF;
  color: #111827;
  transition: border-color 0.2s, box-shadow 0.2s;
  -webkit-appearance: none;
}

.form-input[name="password"] {
  padding-right: 48px; /* Make space for the icon */
}

.form-input:focus {
  outline: none;
  border-color: #4DB6AC;
  box-shadow: 0 0 0 2px rgba(77, 182, 172, 0.2);
}

.form-input::placeholder {
  color: #9CA3AF;
}

.form-input.is-invalid {
  border-color: #EF4444;
}

.form-input.is-invalid:focus {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

.error-message {
  color: #EF4444;
  font-size: 0.875rem;
  margin-top: 6px;
  min-height: 1.2em;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  color: #6B7280;
}

.submit-button {
  width: 100%;
  padding: 14px 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #4DB6AC;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  margin-top: 8px;
}

.submit-button:hover:not(:disabled) {
  background-color: #26A69A;
}

.submit-button:disabled {
  background-color: #9CA3AF;
  cursor: not-allowed;
}
</style>
<template>
  <div class="login-container">
    
    <!-- Login Card -->
    <div class="login-card">
      
      <!-- Header -->
      <div class="card-header">
        <h1>Log In</h1>
        <p>Welcome back! Please enter your details.</p>
      </div>

      <!-- Login Form -->
      <form class="login-form" @submit.prevent="handleLogin">
        
        <!-- Email Group -->
        <div class="form-group">
          <label for="email">Email Address</label>
          <input 
            id="email" 
            v-model="email"
            name="email" 
            type="email" 
            autocomplete="email" 
            required
            class="form-input"
            placeholder="you@example.com"
          >
        </div>

        <!-- Password Group -->
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password" 
            v-model="password"
            name="password" 
            type="password" 
            autocomplete="current-password" 
            required
            class="form-input"
            placeholder="••••••••"
          >
        </div>

        <!-- Submit Button -->
        <div class="form-group">
          <button type="submit" class="submit-button">
            Sign In
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// This script block remains the same. It is not dependent on styling.
import { ref } from 'vue';

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  console.log('Attempting to log in with:');
  console.log('Email:', email.value);
  console.log('Password:', password.value);

  // Here you would add your API call logic with useFetch or $fetch.
  // Example:
  // try {
  //   await $fetch('/api/login', { method: 'POST', body: { email: email.value, password: password.value } });
  //   await navigateTo('/dashboard');
  // } catch (error) {
  //   console.error('Login failed:', error);
  // }
  
  alert(`Form submitted!\nEmail: ${email.value}\nPassword: [REDACTED]\n\nCheck the browser console for details.`);
};
</script>

<style scoped>
/* Scoped CSS: These styles will only apply to elements in this component. */

/* Main container for the whole page */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f3f4f6; /* Light gray background */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* The white card in the center */
.login-card {
  width: 100%;
  max-width: 420px;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Header section with title and subtitle */
.card-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.card-header h1 {
  font-size: 1.875rem; /* 30px */
  font-weight: 700;
  color: #111827;
}

.card-header p {
  margin-top: 0.5rem;
  color: #4b5563;
}

/* Form styling */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* Space between form groups */
}

.form-group {
  width: 100%;
}

/* Form labels */
label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  color: #374151;
}

/* Input fields */
.form-input {
  width: 100%;
  padding: 0.65rem 0.75rem;
  font-size: 1rem;
  color: #111827;
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem; /* 6px */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s, box-shadow 0.2s;
  -webkit-appearance: none; /* Removes default iOS styling */
  -moz-appearance: none;
  appearance: none;
}

/* Focus state for input fields */
.form-input:focus {
  outline: none;
  border-color: #4f46e5; /* Indigo color */
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

/* Submit button styling */
.submit-button {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.875rem; /* 14px */
  font-weight: 600;
  color: #ffffff;
  background-color: #4f46e5; /* Indigo */
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

/* Hover state for the button */
.submit-button:hover {
  background-color: #4338ca;
}

/* Dark Mode Styles */
@media (prefers-color-scheme: dark) {
  .login-container {
    background-color: #111827; /* Dark gray */
  }

  .login-card {
    background-color: #1f2937; /* Lighter dark gray */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  }

  .card-header h1,
  label {
    color: #ffffff;
  }

  .card-header p {
    color: #9ca3af; /* Light gray text */
  }

  .form-input {
    background-color: #374151;
    border-color: #4b5563;
    color: #ffffff;
  }
}
</style>
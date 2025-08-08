<template>
  <div v-if="user" class="dashboard-container">
    <h1>Dashboard</h1>
    <p>Welcome, {{ user.name }}!</p>
    <p>This page is protected.</p>
    <button @click="handleLogout" class="submit-button">Log Out</button>
  </div>
</template>

<script setup lang="ts">
import { RouterNames } from '~/types/RouterNames';

definePageMeta({
  middleware: 'auth',
});

const { user, clearUser, fetchUser } = useAuth();

onMounted(() => {
  fetchUser()
})

const handleLogout = async () => {
  await $fetch('/api/logout', { method: 'POST' });
  clearUser();
  await navigateTo({ name: RouterNames.LOGIN }, { replace: true });
};
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
  background-color: #EF4444;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 24px;
}

.submit-button:hover {
  background-color: #DC2626;
}
</style>
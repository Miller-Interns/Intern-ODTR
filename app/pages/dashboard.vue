<template>
  <div v-if="user" class="dashboard-container">
    <h1>Dashboard</h1>
    <p>Welcome, <strong>{{ user.email }}</strong>!</p>
    <p>This page is protected. If you can see this after reloading, it worked!</p>
    <button @click="handleLogout" class="submit-button">Log Out</button>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const { user } = useAuth();

const handleLogout = async () => {
  await $fetch('/api/logout', { method: 'POST' });
  user.value = null; // Clear the client-side state
  await navigateTo('/login');
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
  background-color: #EF4444; /* Red for logout */
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
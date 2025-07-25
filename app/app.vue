<!-- app.vue -->
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Get our auth composable.
const { fetchUser } = useAuth();

// When the application loads (on server or on client), call fetchUser().
// The `await` is crucial. It ensures that the user's session is checked
// and the `user` state is populated *before* the rest of the app loads.
await fetchUser();
</script>
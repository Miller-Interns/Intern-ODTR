<script setup lang="ts">
const route = useRoute();

// This helper function checks if the given path is the active one.
// It smartly handles nested routes for 'Manage'.
const isActive = (path: string) => {
  if (path === '/manage') {
    return route.path.startsWith('/interns') || route.path === '/manage';
  }
  return route.path === path;
};
</script>

<template>
  <footer
    class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-20 shadow-up z-50"
  >
    <!-- Use NuxtLink for proper navigation -->
    <NuxtLink to="/" class="flex flex-col items-center justify-center w-1/4" :class="isActive('/') ? 'text-teal-600 font-semibold' : 'text-gray-500'">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
      <span class="text-xs">Dashboard</span>
    </NuxtLink>

    <NuxtLink to="/manage" class="flex flex-col items-center justify-center w-1/4" :class="isActive('/manage') ? 'text-teal-600 font-semibold' : 'text-gray-500'">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
      <span class="text-xs">Manage</span>
    </NuxtLink>

    <NuxtLink to="/active-interns" class="flex flex-col items-center justify-center w-1/4" :class="isActive('/active-interns') ? 'text-teal-600 font-semibold' : 'text-gray-500'">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      <span class="text-xs">Active Interns</span>
    </NuxtLink>

    <NuxtLink to="/profile" class="flex flex-col items-center justify-center w-1/4" :class="isActive('/profile') ? 'text-teal-600 font-semibold' : 'text-gray-500'">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
      <span class="text-xs">Profile</span>
    </NuxtLink>
  </footer>
</template>

<style>
/* Custom shadow for the top of the nav bar */
.shadow-up {
  box-shadow: 0 -4px 10px -1px rgb(0 0 0 / 0.07);
}
</style>
<template>
  <div class="bg-gray-50 min-h-screen font-sans">
    <main class="p-4 sm:p-6 md:max-w-4xl md:mx-auto pb-24">
      <slot />
    </main>

    <!-- Bottom Navigation Bar -->
    <footer class="fixed bottom-0 left-0 w-full bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.08)]">
      <nav class="flex justify-around max-w-4xl mx-auto">
        
        <!-- Dashboard Link -->
        <NuxtLink 
          to="/admin/dashboard"
          class="flex-1 text-center py-2 px-1 text-sm text-gray-600 hover:text-black transition-colors"
          active-class="!text-black font-bold border-t-2 border-black"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Dashboard</span>
        </NuxtLink>
        
        <!-- Manage Link -->
        <NuxtLink 
          to="/admin/manage"
          class="flex-1 text-center py-2 px-1 text-sm text-gray-600 hover:text-black transition-colors"
          active-class="!text-black font-bold border-t-2 border-black"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.184-1.268-.5-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.184-1.268.5-1.857m0 0a5.002 5.002 0 019 0m-4.5 4.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
          </svg>
          <span>Manage</span>
        </NuxtLink>

        <!-- Active Interns Link -->
        <NuxtLink 
          to="/admin/active-interns"
          class="flex-1 text-center py-2 px-1 text-sm text-gray-600 hover:text-black transition-colors"
          active-class="!text-black font-bold border-t-2 border-black"
        >
           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a6 6 0 00-12 0v2" />
          </svg>
          <span>Active Interns</span>
        </NuxtLink>
        
        <!-- Profile Link -->
        <NuxtLink 
          to="/admin/profile"
          class="flex-1 text-center py-2 px-1 text-sm text-gray-600 hover:text-black transition-colors"
          active-class="!text-black font-bold border-t-2 border-black"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Profile</span>
        </NuxtLink>
      </nav>
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>
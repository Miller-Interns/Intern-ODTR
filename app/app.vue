<template>
  <!-- UApp is required for some Nuxt UI features like toasts and dark mode -->
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- UNocifications is needed to display toasts from useToast() -->
    <UNotifications />
  </UApp>
</template>
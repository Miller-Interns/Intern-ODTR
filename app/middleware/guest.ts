// middleware/guest.ts (For logged-out users)
export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth();

  if (user.value) {
    return navigateTo('/dashboard');
  }
});
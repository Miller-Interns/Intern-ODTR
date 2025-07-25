// middleware/auth.ts (For logged-in users)
export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth();

  if (!user.value) {
    return navigateTo('/login');
  }
});
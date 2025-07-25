// /app/middleware/guest.ts (For logged-out users)
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetchUser } = useAuth();

  // Ensure we have the latest user state.
  if (!user.value) {
    await fetchUser();
  }

  // If a user is logged in, redirect them away from guest pages.
  if (user.value) {
    return navigateTo('/dashboard', { replace: true });
  }
});
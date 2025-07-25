// /app/middleware/auth.ts (For logged-in users)
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetchUser } = useAuth();

  // If the user state is not yet populated, fetch it.
  if (!user.value) {
    await fetchUser();
  }

  // After attempting to fetch, if the user is still null, then redirect.
  if (!user.value) {
    // *** THIS IS THE FIX ***
    // The query is part of the route object (the first argument), not the options (the second).
    return navigateTo({
      path: '/login',
      query: {
        from: to.fullPath // Redirect back to the intended page after login
      }
    }, {
      replace: true // Use replace to not pollute the history
    });
  }
});
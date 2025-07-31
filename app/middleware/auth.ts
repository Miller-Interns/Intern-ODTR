export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetchUser } = useAuth();

  if (!user.value) {
    await fetchUser();
  }

  if (!user.value) {
    return navigateTo({
      path: '/login',
      query: {
        from: to.fullPath
      }
    }, {
      replace: true // Use replace to not pollute the history
    });
  }
});
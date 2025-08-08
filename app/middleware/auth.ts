import { RouterNames } from '~/types/RouterNames';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetchUser } = useAuth();

  if (!user.value) {
    await fetchUser();
  }

  if (!user.value) {
    return navigateTo({
      name: RouterNames.LOGIN,
      query: {
        from: to.fullPath
      }
    }, {
      replace: true
    });
  }
});
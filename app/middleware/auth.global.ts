
export default defineNuxtRouteMiddleware((to, _from) => {
  const { user } = useUserSession()
 
  const isLoggedIn = !!user.value
  const isAdmin = user.value?.isAdmin === true
  const isAuthRoute = to.name === 'login'
  const isAdminRoute = to.path.startsWith('/admin')
 
  if (isLoggedIn && isAuthRoute) {
    return navigateTo(isAdmin ? '/admin/dashboard' : '/dashboard', { replace: true })
  }
 
  if (!isLoggedIn && !isAuthRoute) {
    return navigateTo('/login', { replace: true })
  }
 
  if (isAdminRoute && !isAdmin) {
    return navigateTo('/dashboard', { replace: true })
  }
 
  return
})
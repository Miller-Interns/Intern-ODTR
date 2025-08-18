export default defineNuxtRouteMiddleware((to) => {
    const { user } = useUserSession()
 
    const isLoggedIn = !!user.value
    const isAdmin = user.value?.isAdmin === true
    const adminDashboardPath = '/admin/dashboard'
    const internDashboardPath = '/intern/dashboard'
    const loginPath = '/login'
 
    if (to.path === loginPath) {
        if (isLoggedIn) {
            return navigateTo(isAdmin ? adminDashboardPath : internDashboardPath, { replace: true })
        }
        return
    }
 
    if (!isLoggedIn) {
        return navigateTo(loginPath, { replace: true })
    }
 
    const isAdminRoute = to.path.startsWith('/admin')
    const isInternRoute = !isAdminRoute
 
    if (isAdmin && isInternRoute) {
        return navigateTo(adminDashboardPath, { replace: true })
    }
    if (!isAdmin && isAdminRoute) {
        return navigateTo(internDashboardPath, { replace: true })
    }
    return
})
 
 
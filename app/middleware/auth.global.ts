import { RouterNames } from '~/types/RouterNames'

export default defineNuxtRouteMiddleware(async (to, from) => {
	const { loggedIn, fetch } = useUserSession()
	await fetch()

	if (loggedIn.value) {
		if (to.name === 'login' || to.name === undefined) {
			return navigateTo({ name: 'dashboard' }, { replace: true })
		}
	}
	if (to.name !== 'login' && !loggedIn.value) {
		return navigateTo({ name: 'login' }, { replace: true })
	}
})

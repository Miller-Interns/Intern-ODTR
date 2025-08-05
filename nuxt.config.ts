import type { NuxtConfig } from 'nuxt/config'

const runtimeConfig: NuxtConfig['runtimeConfig'] = {
	DATABASE_URL: process.env.POSTGRES_CONNECTION_URL,
}

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },

	runtimeConfig,

	modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/image'],
	css: ['@/assets/css/main.css'],
	serverHandlers: [
		{
			route: '/api/login',
			handler: '~/server/api/login.post.ts',
		},
		{
			route: '/api/logout',
			handler: '~/server/api/logout.post.ts',
		},
		{
			route: '/api/user',
			handler: '~/server/api/user.get.ts',
		},
		{
			handler: '~/server/middleware/auth.ts',
			middleware: true,
		}
	],
})
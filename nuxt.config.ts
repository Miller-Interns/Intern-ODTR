import type { NuxtConfig } from 'nuxt/config'

const runtimeConfig: NuxtConfig['runtimeConfig'] = {
	DATABASE_URL: process.env.POSTGRES_CONNECTION_URL,
	JWT_SECRET: process.env.JWT_SECRET,
	session: {
		password: process.env.JWT_SECRET as string,
		maxAge: 60 * 60 * 18,
	},
}

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },

	runtimeConfig,

	modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/image', 'nuxt-auth-utils'],
	css: ['@/assets/css/main.css'],

	imports: {
    dirs: [
      'enums/**',
    ],
  },

  serverDir:'./app/server'
	
})



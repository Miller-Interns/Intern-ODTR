// https://nuxt.com/docs/api/configuration/nuxt-config

import type { NuxtConfig } from 'nuxt/config'

const runtimeConfig: NuxtConfig['runtimeConfig'] = {
	DATABASE_URL: process.env.POSTGRES_CONNECTION_URL,
}

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },

	runtimeConfig,

	modules: ['@nuxt/eslint', '@nuxt/ui'],
	css: ['@/assets/css/main.css'],

	imports: {
    dirs: [
      'enums/**',
    ],
  },

  serverDir:'./app/server'
	
})

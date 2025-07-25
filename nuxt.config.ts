// // // https://nuxt.com/docs/api/configuration/nuxt-config

// import { defineNuxtConfig, type NuxtConfig } from 'nuxt/config'

// const runtimeConfig: NuxtConfig['runtimeConfig'] = {
//     DATABASE_URL: process.env.POSTGRES_CONNECTION_URL,
// }

// export default defineNuxtConfig({
//   compatibilityDate: '2025-07-15',
//   devtools: { enabled: true },
//    modules: ['@nuxtjs/tailwindcss', '@prisma/nuxt', '@nuxt/eslint'],
//    runtimeConfig: {
    
//      public: {
//       DATABASE_URL: process.env.DATABASE_URL,
//      }
//     }
// })

// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
import type { NuxtConfig } from 'nuxt/config'

const runtimeConfig: NuxtConfig['runtimeConfig'] = {
	DATABASE_URL: process.env.POSTGRES_CONNECTION_URL,
}

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },

	runtimeConfig,

	modules: ['@prisma/nuxt', '@nuxt/eslint', '@nuxtjs/tailwindcss'],
	alias: {
    // Update the alias to point to your custom output directory
    '.prisma/client/index-browser': fileURLToPath(
      new URL('./app/generated/prisma/index-browser.js', import.meta.url)
    ),
	},		
})
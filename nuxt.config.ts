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

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // This is the standard way to define runtime config.
  runtimeConfig: {
    // This key 'databaseUrl' is only available on the server.
    // It reads its value from the .env file variable named DATABASE_URL.
    databaseUrl: process.env.POSTGRES_CONNECTION_URL,
  },

  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss'],

  alias: {
    '@/generated/prisma': fileURLToPath(new URL('./app/generated/prisma', import.meta.url)),
  },

  nitro: {
    alias: {
      // This tells Nitro where to find the browser client during the server build
      '.prisma/client/index-browser': fileURLToPath(
        new URL('./app/generated/prisma/index-browser.js', import.meta.url)
      ),
    }
  },
})
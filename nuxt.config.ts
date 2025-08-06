// // // https://nuxt.com/docs/api/configuration/nuxt-config

import type { NuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'

const runtimeConfig: NuxtConfig['runtimeConfig'] = {
  DATABASE_URL: process.env.POSTGRES_CONNECTION_URL,
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig,

  modules: ['@nuxt/eslint', '@nuxt/ui', '@vueuse/nuxt'],
  css: ['@/assets/css/main.css'],
  alias: {
    '@/generated/prisma': fileURLToPath(new URL('./app/generated/prisma', import.meta.url)),
  },

  nitro: {
    alias: {
      '.prisma/client/index-browser': fileURLToPath(
        new URL('./app/generated/prisma/index-browser.js', import.meta.url)
      ),
    }
  },

  serverDir: './app/server'
})

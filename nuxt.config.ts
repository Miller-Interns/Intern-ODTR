// https://nuxt.com/docs/api/configuration/nuxt-config

import type { NuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'

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

  serverDir: 'app/server',

  modules: ['@nuxt/eslint', '@nuxt/ui', '@vueuse/nuxt', '@nuxt/image', 'nuxt-auth-utils'],
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


})

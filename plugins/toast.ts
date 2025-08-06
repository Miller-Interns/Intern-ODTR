import { defineNuxtPlugin } from '#app'
import Toast, { PluginOptions, POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
    const options: PluginOptions = {
        position: 'POSITION.TOP_RIGHT',
        timeout: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        newestOnTop: true,
        transition: 'Vue-Toastification__bounce',
        toastClassName: 'bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700',
        bodyClassName: 'text-gray-900 dark:text-gray-100 font-medium',
    }

    nuxtApp.vueApp.use(Toast, options)
})

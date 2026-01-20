// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  ssr: false,
  compatibilityDate: '2024-04-03',
  app: {
    baseURL: process.env.NUXT_PUBLIC_BASE_URL || '/BrokenPix_Ankets/',
    buildAssetsDir: 'assets'
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.NUXT_PUBLIC_BASE_URL || '/BrokenPix_Ankets/'
    }
  }
})


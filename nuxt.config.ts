// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  ssr: false,
  compatibilityDate: '2024-04-03',
  app: {
    baseURL: '/BrokenPix_Ankets/',
    buildAssetsDir: 'assets'
  },
  runtimeConfig: {
    public: {
      baseURL: '/BrokenPix_Ankets/'
    }
  }
})


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@vueuse/nuxt'],
  css: ['./assets/css/main.css', './assets/css/fonts.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  
  // Runtime configuration for Shopware API
  runtimeConfig: {
    // Server-side only (not exposed to client)
    shopwareApiUrl: process.env.SHOPWARE_API_URL || 'https://main-bvxea6i-nk6gauqgyeg4y.de-2.platformsh.site',
    shopwareAccessKey: process.env.SHOPWARE_ACCESS_KEY || 'SWSCYJIXAENWBGJDEG83NWJXRG',
    
    // Public (exposed to client)
    public: {
      shopwareApiUrl: process.env.SHOPWARE_API_URL || 'https://main-bvxea6i-nk6gauqgyeg4y.de-2.platformsh.site',
    },
  },
  
  // Nitro server configuration
  nitro: {
    routeRules: {
      // Allow API proxy routes
      '/api/shopware/**': {
        cors: true,
      },
    },
  },
})

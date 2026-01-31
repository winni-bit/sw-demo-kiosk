/**
 * Auth Middleware
 * 
 * Protects account pages and redirects to login if not authenticated
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side
  if (import.meta.server) return
  
  const { isLoggedIn, isInitialized, initAuth } = useShopwareAuth()
  
  // Initialize auth if not already done
  if (!isInitialized.value) {
    await initAuth()
  }
  
  // Check if user is logged in
  if (!isLoggedIn.value) {
    console.log('[Auth Middleware] User not logged in, redirecting to login')
    
    // Store the intended destination
    const redirectTo = to.fullPath
    
    return navigateTo({
      path: '/account/login',
      query: redirectTo !== '/account' ? { redirect: redirectTo } : undefined,
    })
  }
})

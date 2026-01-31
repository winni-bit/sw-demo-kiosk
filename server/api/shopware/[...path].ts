/**
 * Shopware 6 API Proxy
 * 
 * Proxies all requests to /api/shopware/* to the Shopware Store API
 * Handles context token management via cookies
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Get the path from the URL (everything after /api/shopware/)
  const path = event.context.params?.path || ''
  
  // Get query parameters from the original request
  const query = getQuery(event)
  
  // Build the Shopware API URL
  const shopwareBaseUrl = config.shopwareApiUrl || 'https://main-bvxea6i-nk6gauqgyeg4y.de-2.platformsh.site'
  const shopwareAccessKey = config.shopwareAccessKey || 'SWSCYJIXAENWBGJDEG83NWJXRG'
  
  // Build URL with query parameters
  let targetUrl = `${shopwareBaseUrl}/store-api/${path}`
  
  // Append query parameters if present
  if (Object.keys(query).length > 0) {
    const queryString = new URLSearchParams()
    
    for (const [key, value] of Object.entries(query)) {
      if (Array.isArray(value)) {
        // Handle array parameters like ids[]
        value.forEach(v => queryString.append(key, String(v)))
      } else if (value !== undefined && value !== null) {
        queryString.append(key, String(value))
      }
    }
    
    const queryStr = queryString.toString()
    if (queryStr) {
      targetUrl += `?${queryStr}`
    }
  }
  
  // Get context token from cookie or header
  const contextTokenCookie = getCookie(event, 'sw-context-token')
  const contextTokenHeader = getHeader(event, 'sw-context-token')
  const contextToken = contextTokenHeader || contextTokenCookie
  
  // Get request body for POST/PATCH requests
  let body: any = null
  const method = event.method
  
  if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
    try {
      body = await readBody(event)
    } catch (e) {
      // No body provided
    }
  }
  
  // Build headers for Shopware request
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'sw-access-key': shopwareAccessKey,
  }
  
  if (contextToken) {
    headers['sw-context-token'] = contextToken
  }
  
  console.log(`[Shopware Proxy] ${method} ${targetUrl}`)
  console.log(`[Shopware Proxy] Context Token: ${contextToken ? contextToken.substring(0, 20) + '...' : 'none'}`)
  if (body) {
    console.log(`[Shopware Proxy] Body:`, JSON.stringify(body))
  }
  
  try {
    // Make request to Shopware
    const response = await $fetch.raw(targetUrl, {
      method: method as any,
      headers,
      body: body,
    })
    
    // Get the new context token from response headers
    const newContextToken = response.headers.get('sw-context-token')
    
    console.log(`[Shopware Proxy] Response status: ${response.status}`)
    console.log(`[Shopware Proxy] New context token: ${newContextToken ? newContextToken.substring(0, 20) + '...' : 'none'}`)
    
    // Log response data (truncated for large responses)
    const responseData = response._data
    const responseStr = JSON.stringify(responseData)
    console.log(`[Shopware Proxy] Response data (${responseStr.length} chars):`, responseStr.substring(0, 500))
    
    if (newContextToken) {
      // Set the context token as a cookie
      setCookie(event, 'sw-context-token', newContextToken, {
        httpOnly: false, // Allow JS access for client-side requests
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })
      
      // Also return it in response header
      setHeader(event, 'sw-context-token', newContextToken)
    }
    
    return response._data
  } catch (error: any) {
    console.error('[Shopware Proxy] Error:', error.message)
    console.error('[Shopware Proxy] Status:', error.response?.status)
    console.error('[Shopware Proxy] Data:', JSON.stringify(error.response?._data || error.data))
    
    // Handle Shopware API errors
    if (error.response) {
      const statusCode = error.response.status || 500
      const errorData = error.response._data || error.data
      
      throw createError({
        statusCode,
        statusMessage: error.message,
        data: errorData,
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to connect to Shopware API',
      data: { message: error.message },
    })
  }
})

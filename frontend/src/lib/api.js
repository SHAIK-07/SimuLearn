const backendMode = import.meta.env.VITE_BACKEND_MODE || 'local'
const localBackendUrl = import.meta.env.VITE_LOCAL_BACKEND_URL || 'http://localhost:8000'
const renderBackendUrl = import.meta.env.VITE_RENDER_BACKEND_URL || ''

// Export the resolved API URL based on configuration
export const BACKEND_URL = backendMode === 'render' ? renderBackendUrl : localBackendUrl

if (backendMode === 'render' && !renderBackendUrl) {
  console.warn(
    'Backend mode is set to "render" but VITE_RENDER_BACKEND_URL is not configured.'
  )
}

console.log(`[API Config] Mode: ${backendMode}, Target URL: ${BACKEND_URL}`)

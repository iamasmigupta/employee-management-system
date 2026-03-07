import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    define: {
      // Ensure env vars are always available in production builds
      'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(
        env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_c3VyZS1tdWxsZXQtMTYuY2xlcmsuYWNjb3VudHMuZGV2JA'
      ),
      'import.meta.env.VITE_API_URL': JSON.stringify(
        env.VITE_API_URL || (mode === 'production'
          ? 'https://employee-management-system-36in.onrender.com'
          : 'http://localhost:5001')
      ),
    },
  }
})

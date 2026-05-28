import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const repoRoot = path.resolve(__dirname, '..')
  // const env = loadEnv(mode, repoRoot, '')
  const env = { ...loadEnv(mode, repoRoot, ''), ...process.env }
  const apiTarget = env.VITE_API_URL

  return {
    base: '/multilingual-transcription/',

    plugins: [react()],
    envDir: repoRoot,
    server: {
      proxy: {
        '/transcription': apiTarget,
        '/job': apiTarget,
        '/metrics': apiTarget,
      },
    },
  }
})

import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    allowedHosts: true, // Allows all hosts, solving the ngrok blocked request issue
  }
})

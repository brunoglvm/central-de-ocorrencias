import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  sourcemap: true, // Maps generated JavaScript back to the original TypeScript for easier debugging
})

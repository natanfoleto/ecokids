import { defineConfig } from 'tsup'

// Configurações de build
export default defineConfig({
  entry: ['src'],
  splitting: false,
  sourcemap: true,
  clean: true,
  noExternal: ['@ecokids/auth', '@ecokids/env', '@ecokids/types'],
})

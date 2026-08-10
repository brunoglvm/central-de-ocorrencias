import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import tailwindcss from 'eslint-plugin-tailwindcss'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    plugins: {
      tailwindcss,
    },
    settings: {
      tailwindcss: {
        cssConfigPath: './src/app/globals.css',
      },
    },
    rules: {
      'tailwindcss/no-contradicting-classname': 'warn', // Detecta classes Tailwind que entram em conflito
      'tailwindcss/no-unnecessary-arbitrary-value': 'warn', // Detecta valores arbitrários desnecessários
      'tailwindcss/enforces-shorthand': 'warn', // Sugere o uso de shorthand quando possível
      'tailwindcss/enforces-negative-arbitrary-values': 'warn', // Verifica a sintaxe de valores arbitrários negativos
      'tailwindcss/important-modifier-suffix': 'warn', // Verifica a sintaxe do modificador !important
      'tailwindcss/no-custom-classname': 'warn', // Detecta classes que não pertencem ao Tailwind
      'tailwindcss/no-arbitrary-value': 'off', // Permite o uso de valores arbitrários
    },
  },

  {
    files: ['src/lib/utils.ts'], // cn() gera um falso positivo em 'no-custom-classname'
    rules: {
      'tailwindcss/no-custom-classname': 'off',
    },
  },

  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])

export default eslintConfig

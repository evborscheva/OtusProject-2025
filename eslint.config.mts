import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], 
    languageOptions: { globals: globals.node,
      parserOptions: {
        tsconfigRootDir: process.cwd(),
     } }},
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  globalIgnores(['reports/**', 'node_modules/**', 'coverage/**', 'playwright-report', 'test-results']),
  eslintPluginPrettierRecommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]);
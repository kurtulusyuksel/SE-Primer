import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents() {
      // Node event'leri gerekirse buraya eklenebilir
    },
  },
});
import { createRequire } from 'node:module';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5';
const require = createRequire( import.meta.url );
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ckeditor5( { theme: require.resolve( '@ckeditor/ckeditor5-theme-lark' ) } )
  ],
  resolve: {
    alias: [{ find: '@', replacement: '/src' }]
  }
})

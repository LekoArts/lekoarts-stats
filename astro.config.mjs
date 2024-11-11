import react from '@astrojs/react'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [vanillaExtractPlugin()],
	},
	integrations: [
		react(),
	],
})

import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
            // Opciones por defecto para una SPA (Single Page Application)
            pages: 'build',
            assets: 'build',
            fallback: 'index.html', // O '200.html' si el hosting lo requiere
            precompress: false,
            strict: true
        }),
		prerender: {
            // Esta línea es una orden directa para que no intente visitar ninguna página
            entries: []
        }
	}
};

export default config;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: ['@nuxt/ui'],
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: ` @use "normalize.css" as *; 
						@use "~/assets/style/style" as *; `,
				},
			},
		},
	},
});

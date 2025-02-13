import { join } from 'path';
import type { Config } from 'tailwindcss';
// @ts-ignore
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin';
import { duelovky } from './src/duelovky';

export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			fontFamily: {
				heading: ['Merriweather']
			},
			fontSize: {
				'5xl': '52px'
			}
		},
		container: {
			center: true,
			padding: '2rem'
		}
	},
	plugins: [
		typography,
		skeleton({
			themes: {
				custom: [duelovky]
			}
		})
	]
} satisfies Config;

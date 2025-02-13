import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const duelovky: CustomThemeConfig = {
	name: 'duelovky',
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base': `Nunito, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		'--theme-font-family-heading': `Merriweather, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		'--theme-font-color-base': '0 0 0',
		'--theme-font-color-dark': '255 255 255',
		'--theme-rounded-base': '4px',
		'--theme-rounded-container': '12px',
		'--theme-border-base': '0px',
		// =~= Theme On-X Colors =~=
		'--on-primary': '255 255 255',
		'--on-secondary': '0 0 0',
		'--on-tertiary': '255 255 255',
		'--on-success': '0 0 0',
		'--on-warning': '255 255 255',
		'--on-error': '255 255 255',
		'--on-surface': '255 255 255',
		// =~= Theme Colors  =~=
		// primary | #2a8708
		'--color-primary-50': '223 237 218', // #dfedda
		'--color-primary-100': '212 231 206', // #d4e7ce
		'--color-primary-200': '202 225 193', // #cae1c1
		'--color-primary-300': '170 207 156', // #aacf9c
		'--color-primary-400': '106 171 82', // #6aab52
		'--color-primary-500': '42 135 8', // #2a8708
		'--color-primary-600': '38 122 7', // #267a07
		'--color-primary-700': '32 101 6', // #206506
		'--color-primary-800': '25 81 5', // #195105
		'--color-primary-900': '21 66 4', // #154204
		// secondary | #fd6717
		'--color-secondary-50': '255 232 220', // #ffe8dc
		'--color-secondary-100': '255 225 209', // #ffe1d1
		'--color-secondary-200': '255 217 197', // #ffd9c5
		'--color-secondary-300': '254 194 162', // #fec2a2
		'--color-secondary-400': '254 149 93', // #fe955d
		'--color-secondary-500': '253 103 23', // #fd6717
		'--color-secondary-600': '228 93 21', // #e45d15
		'--color-secondary-700': '190 77 17', // #be4d11
		'--color-secondary-800': '152 62 14', // #983e0e
		'--color-secondary-900': '124 50 11', // #7c320b
		// tertiary | #404040
		'--color-tertiary-50': '226 226 226', // #e2e2e2
		'--color-tertiary-100': '217 217 217', // #d9d9d9
		'--color-tertiary-200': '207 207 207', // #cfcfcf
		'--color-tertiary-300': '179 179 179', // #b3b3b3
		'--color-tertiary-400': '121 121 121', // #797979
		'--color-tertiary-500': '64 64 64', // #404040
		'--color-tertiary-600': '58 58 58', // #3a3a3a
		'--color-tertiary-700': '48 48 48', // #303030
		'--color-tertiary-800': '38 38 38', // #262626
		'--color-tertiary-900': '31 31 31', // #1f1f1f
		// success | #00ff11
		'--color-success-50': '217 255 219', // #d9ffdb
		'--color-success-100': '204 255 207', // #ccffcf
		'--color-success-200': '191 255 196', // #bfffc4
		'--color-success-300': '153 255 160', // #99ffa0
		'--color-success-400': '77 255 88', // #4dff58
		'--color-success-500': '0 255 17', // #00ff11
		'--color-success-600': '0 230 15', // #00e60f
		'--color-success-700': '0 191 13', // #00bf0d
		'--color-success-800': '0 153 10', // #00990a
		'--color-success-900': '0 125 8', // #007d08
		// warning | #b00c3e
		'--color-warning-50': '243 219 226', // #f3dbe2
		'--color-warning-100': '239 206 216', // #efced8
		'--color-warning-200': '235 194 207', // #ebc2cf
		'--color-warning-300': '223 158 178', // #df9eb2
		'--color-warning-400': '200 85 120', // #c85578
		'--color-warning-500': '176 12 62', // #b00c3e
		'--color-warning-600': '158 11 56', // #9e0b38
		'--color-warning-700': '132 9 47', // #84092f
		'--color-warning-800': '106 7 37', // #6a0725
		'--color-warning-900': '86 6 30', // #56061e
		// error | #b00707
		'--color-error-50': '243 218 218', // #f3dada
		'--color-error-100': '239 205 205', // #efcdcd
		'--color-error-200': '235 193 193', // #ebc1c1
		'--color-error-300': '223 156 156', // #df9c9c
		'--color-error-400': '200 81 81', // #c85151
		'--color-error-500': '176 7 7', // #b00707
		'--color-error-600': '158 6 6', // #9e0606
		'--color-error-700': '132 5 5', // #840505
		'--color-error-800': '106 4 4', // #6a0404
		'--color-error-900': '86 3 3', // #560303
		// surface | #454545
		'--color-surface-50': '227 227 227', // #e3e3e3
		'--color-surface-100': '218 218 218', // #dadada
		'--color-surface-200': '209 209 209', // #d1d1d1
		'--color-surface-300': '181 181 181', // #b5b5b5
		'--color-surface-400': '125 125 125', // #7d7d7d
		'--color-surface-500': '69 69 69', // #454545
		'--color-surface-600': '62 62 62', // #3e3e3e
		'--color-surface-700': '52 52 52', // #343434
		'--color-surface-800': '41 41 41', // #292929
		'--color-surface-900': '34 34 34' // #222222
	}
};

import type cs from './locales/cs';

export type Locale = 'cs' | 'en';

export type TranslationSchema = {
	[K in keyof typeof cs]: {
		[P in keyof (typeof cs)[K]]: string;
	};
};

type Join<K, P> = K extends string | number
	? P extends string | number
		? `${K}${'' extends P ? '' : '.'}${P}`
		: never
	: never;

type PathsToStringProps<T> = T extends string
	? ''
	: {
			[K in Extract<keyof T, string>]: Join<K, PathsToStringProps<T[K]>>;
		}[Extract<keyof T, string>];

export type TranslationKey = PathsToStringProps<typeof cs>;

export type TranslateFn = (key: TranslationKey, params?: Record<string, string | number>) => string;

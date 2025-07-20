export function slugify(text: string) {
	return text
		.normalize('NFD') // decompose accented characters
		.replace(/[\u0300-\u036f]/g, '') // remove diacritics
		.replace(/[^a-zA-Z0-9]/g, '') // remove non-alphanumeric characters
		.toLowerCase(); // convert to lowercase
}

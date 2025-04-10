import { API } from '../src/constants/urls';

export default async () => {
	const res = await fetch(`${API}/test-api/reset`, {
		method: 'POST'
	});

	if (!res.ok) {
		throw new Error(`Failed to reset test database: ${res.statusText}`);
	}
};

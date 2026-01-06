import type { RequestHandler } from '@sveltejs/kit';
import { getUserFromEmail, addUser } from '$lib/server/db';

export const GET: RequestHandler = async (event) => {
	// this will check if the user exists and if not make an account
	const session = await event.locals.auth();

	if (!session || !session.user?.email) {
		return new Response('Unauthorized', { status: 401 });
	}

	const email = session.user.email;
	const slack_id = session.user.slack_id as string;
	const name = session.user.name as string;

	if (!email || !slack_id || !name) {
		console.warn('Invalid User: ', session);
		return new Response('Unauthorized or incomplete user', { status: 401 });
	}

	console.log('got request to check user');

	const User = await getUserFromEmail(email);
	if (User != null) {
		// Check if user exists
		console.log('user exists');
		return new Response(JSON.stringify({ message: 'user exists' }));
	}

	await addUser({ email, slack_id, name });
	console.log('added user');

	return new Response(JSON.stringify({ message: 'added user' }));
};

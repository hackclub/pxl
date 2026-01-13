import type { RequestHandler, RequestEvent } from './$types';
import { givePixels } from '$lib/server/db';
import { checkRateLimit } from '$lib/server/ratelimit';

function jsonError(message: string, status: number) {
	return new Response(JSON.stringify({ error: message }), {
		status,
		headers: { 'Content-Type': 'application/json' }
	});
}

interface Session {
	user?: {
		email?: string;
	};
}

interface RequestBody {
	slack_id: string;
	number_to_add: number;
}

export const POST: RequestHandler = async (event: RequestEvent) => {
	const session: Session = await event.locals.auth();

	// Require login
	if (!session || !session.user?.email) {
		return jsonError('Unauthorized', 401);
	}

	// Allow 50 placements per 10 seconds
	if (!checkRateLimit(session.user.email, 50, 10000)) {
		return jsonError('Too many requests, slow down!', 429);
	}

	const { request } = event;
	const body: RequestBody | undefined = await request.json();

	const { slack_id, number_to_add } = body ?? {};

	if (!slack_id) {
		return jsonError('Slack ID not found', 400);
	}
};

import type { RequestHandler, RequestEvent } from './$types';
import { givePixels } from '$lib/server/db';
import { env } from '$env/dynamic/private';

function jsonError(message: string, status: number) {
	return new Response(JSON.stringify({ error: message }), {
		status,
		headers: { 'Content-Type': 'application/json' }
	});
}

interface RequestBody {
	slack_id: string;
	number_to_add: number;
}

export const POST: RequestHandler = async (event: RequestEvent) => {
	const { request } = event;

	// Check for API key in Authorization header
	const authHeader = request.headers.get('Authorization');
	const apiKey = authHeader?.replace('Bearer ', '');

	// Validate API key
	const validApiKey = env.GIVE_PIXELS_API_KEY;
	if (!validApiKey) {
		console.error('GIVE_PIXELS_API_KEY not configured in environment');
		return jsonError('Server configuration error', 500);
	}

	if (!apiKey || apiKey !== validApiKey) {
		return jsonError('Invalid or missing API key', 401);
	}

	const body: RequestBody | undefined = await request.json();

	const { slack_id, number_to_add } = body ?? {};

	if (!slack_id) {
		return jsonError('Slack ID not found', 400);
	}

	const result = await givePixels(slack_id, Number(number_to_add));
	return new Response(JSON.stringify({ success: true, result }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};

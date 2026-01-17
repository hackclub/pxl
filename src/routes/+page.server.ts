import { getUserFromEmail } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	const signedIn = Boolean(session?.user?.email);
	let isBetaTester: boolean;

	if (session?.user?.email) {
		// REMOVE AFTER BETA
		const user = await getUserFromEmail(session.user.email);
		isBetaTester = user?.is_Beta_Tester ?? false;
	} else {
		isBetaTester = false;
	}

	return {
		signedIn,
	};
};

import { getUserFromEmail } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	const logged_in = Boolean(session?.user?.email);
	var is_Beta_Tester: boolean;

	if (session?.user?.email) { // REMOVE AFTER BETA
		const user = await getUserFromEmail(session.user.email);
		is_Beta_Tester = user?.is_Beta_Tester ?? false;
	} else {
		is_Beta_Tester = false;
	}

	return {
		logged_in,
		is_Beta_Tester // REMOVE AFTER BETA
	};
};

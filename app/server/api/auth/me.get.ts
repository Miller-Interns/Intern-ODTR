// app/server/api/auth/me.get.ts

import { getCurrentUser } from '~/server/use-case/get-current-user.use-case'
import { checkAuthentication } from '~/server/utils/check-authentication';

export default defineEventHandler(async (event) => {
    // FIX: Get the userId string directly
	const userId = await checkAuthentication(event.context);

    // Call the existing use case with the ID and the full context
	return getCurrentUser({ id: userId }, event.context);
})
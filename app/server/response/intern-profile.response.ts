import type { Selectable } from 'kysely'
import type { Intern, User } from '../db/types'

// This is the expected shape of the data coming from the service layer
type ProfileData = Selectable<Intern> & { email: string; name: string | null }

/**
 * Formats the raw database profile object into the specific structure
 * required by the profile API endpoint.
 */
export const createInternProfileResponse = (profile: ProfileData) => {
	// For now, we simply nest the profile data under a 'profile' key.
	// This structure allows for adding more metadata to the response in the future if needed.
	return {
		profile: profile,
	}
}

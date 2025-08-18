import type { Selectable } from 'kysely'
import type { Intern, User } from '../db/types'

type ProfileData = Selectable<Intern> & { email: string; name: string | null }

export const createInternProfileResponse = (profile: ProfileData) => {
	return {
		profile: profile,
	}
}

import bcrypt from 'bcrypt'
import { createInternAndUser } from '~/server/services/add-intern.service'
import type { InternRequestBody } from '~/interfaces/interfaces'

export interface InternData extends Omit<InternRequestBody, 'password' | 'courseYear'> {
	hashedPassword: string
	course: string
	year_level: string
}

export async function createInternUseCase(requestBody: InternRequestBody) {
	const {
		firstName,
		middleName,
		lastName,
		email,
		password,
		school,
		courseYear,
		requiredHours,
		note,
		role,
		contactNumber,
		emergencyContactPerson,
		emergencyContactNumber,
	} = requestBody

	if (!firstName || !lastName || !email || !password || !school || !courseYear || requiredHours === undefined) {
		throw createError({ statusCode: 400, statusMessage: 'Missing required fields.' })
	}

	const courseParts = courseYear.split(/\s*-\s*/).map(part => part.trim())

	if (courseParts.length !== 2 || !courseParts[0] || !courseParts[1]) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Please format "Course and Year Level" as "Course - Year" (e.g., "BSCOE - 3rd Year").'
		})
	}

	const [course, year_level] = courseParts
	const hashedPassword = await bcrypt.hash(password, 10)
	const internData: InternData = {
		firstName,
		middleName,
		lastName,
		email,
		hashedPassword,
		school,
		course,
		year_level,
		requiredHours,
		note,
		role,
		contactNumber,
		emergencyContactPerson,
		emergencyContactNumber,
	}

	const newIntern = await createInternAndUser(internData)

	return newIntern
}
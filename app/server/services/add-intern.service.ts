import prisma from '~/server/utils/prisma'
import { Status } from '~/generated/prisma'
import type { InternData } from '~/server/use-cases/useAddIntern'

export async function createInternAndUser(internData: InternData) {
	const {
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
	} = internData

	const latestBatch = await prisma.batch.findFirst({
		orderBy: {
			start_date: 'desc',
		},
	})

	if (!latestBatch) {
		throw createError({
			statusCode: 404,
			statusMessage: 'No batches found. Please create a batch first.',
		})
	}

	const result = await prisma.$transaction(async (tx) => {
		const newUser = await tx.user.create({
			data: {
				name: `${lastName}, ${firstName}${middleName ? ` ${middleName}` : ''}`,
				email: email,
				password: hashedPassword,
				isAdmin: false,
			},
		})

		const newIntern = await tx.intern.create({
			data: {
				user_id: newUser.id,
				batch_id: latestBatch.id,
				school: school,
				required_hours: requiredHours,
				status: Status.INCOMING,
				note: note || '',
				course: course,
				year: year_level,
				contact_number: contactNumber,
				role: role,
				emergency_contact_number: emergencyContactNumber,
				emergency_contact_person: emergencyContactPerson,
			},
		})

		return newIntern
	})

	return result
}
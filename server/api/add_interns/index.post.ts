import { PrismaClient, Status } from '~/generated/prisma'
import bcrypt from 'bcrypt'
import type { InternRequestBody } from '~/interfaces/interfaces'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
	try {
		const body: InternRequestBody = await readBody(event)

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

		} = body

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
		const [course, year_level] = courseParts;

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

		const hashedPassword = await bcrypt.hash(password, 10)

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

			return { newUser, newIntern }
		})

		event.res.statusCode = 201
		return {
			message: 'Intern created successfully!',
			data: result.newIntern,
		}
	} catch (error: any) {
		console.error('Error in POST /api/add_interns:', error)
		if (error.code === 'P2002') {
			throw createError({
				statusCode: 409,
				statusMessage: `An account with this email already exists.`
			})
		}
		throw createError({
			statusCode: error.statusCode || 500,
			statusMessage: error.statusMessage || 'An internal server error occurred.',
		})
	}
})
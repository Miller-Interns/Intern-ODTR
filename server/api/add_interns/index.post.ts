import { PrismaClient, Status } from '~/generated/prisma'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

interface InternRequestBody {
	firstName: string
	middleName: string
	lastName: string
	email: string
	password: string
	school: string
	requiredHours: number
	status: Status
	note: string
}

export default defineEventHandler(async (event) => {
	try {
		const body: InternRequestBody = await readBody(event)

		const { firstName, middleName, lastName, email, password, school, requiredHours, status, note } = body

		if (!firstName || !lastName || !email || !password || !school || requiredHours === undefined || status === undefined) {
			throw createError({ statusCode: 400, statusMessage: 'Missing required fields.' })
		}

		const latestBatch = await prisma.batch.findFirst({
			orderBy: {
				start_date: 'desc',
			},
		})

		//this is for testing only hehe
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
					name: `${lastName}, ${firstName} ${middleName}`,
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
					status: status,
					note: note,
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
		console.error('Error in POST /api/interns:', error)
		throw createError({
			statusCode: error.statusCode || 500,
			statusMessage: error.statusMessage || 'An internal server error occurred.',
		})
	}
})

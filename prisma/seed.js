import { PrismaClient, Status } from '../app/generated/prisma/index.js'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const SALT_ROUNDS = 10

async function main() {
	console.log(`Start seeding ...`)
	console.log('-> Deleting existing data...')
	await prisma.timeLog.deleteMany()
	await prisma.intern.deleteMany()
	await prisma.batch.deleteMany()
	await prisma.user.deleteMany()
	console.log('-> Existing data deleted.')

	console.log('-> Preparing user data...')
	// Corrected the internUser1Id to match the user list
	const internUser1Id = 'ada24d94-f49e-4af1-91f0-64056ad149eb'
	const internUser2Id = 'a7c4a8a0-2b1d-4f1e-9d6c-2e9b9c0a3b1d'
	const supervisorId = '015084bc-bec3-4373-aec3-729fba0a825a'

	const usersToCreate = [
		{
			id: supervisorId,
			email: 'alyssa.palencia@mllrdev.com',
			name: 'Alyssa Palencia',
			password: 'mllrdev321',
			isAdmin: true,
		},
		{
			id: '0908da60-40f8-4b20-948c-dca792a64860',
			email: 'karl.zablan@mllrdev.com',
			name: 'Karl Zablan',
			password: 'mllrdev321',
			isAdmin: true,
		},
		{
			id: 'cef438de-359c-4802-97ca-66d74dd50cf1',
			email: 'seth.cornelio@mllrdev.com',
			name: 'Seth Cornelio',
			password: 'mllrdev321',
			isAdmin: true,
		},
		{
			id: 'ada24d94-f49e-4af1-91f0-64056ad149ec', // This user is an admin
			email: 'sheen.balatero@mllrdev.com',
			name: 'Sheen Balatero',
			password: 'mllrdev321',
			isAdmin: true,
		},
		{
			id: internUser1Id, // This ID matches the intern's user_id
			email: 'paculba.herielkaye@gmail.com',
			name: 'Heriel Kaye Paculba',
			password: 'test321',
			isAdmin: false,
		},
		{
			id: internUser2Id,
			email: 'john.doe@example.com',
			name: 'John Doe',
			password: 'test321',
			isAdmin: false,
		},
	]

	console.log('-> Hashing passwords...')
	const usersWithHashedPasswords = await Promise.all(
		usersToCreate.map(async (user) => {
			const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS)
			return { ...user, password: hashedPassword }
		}),
	)

	console.log('-> Creating users...')
	await prisma.user.createMany({
		data: usersWithHashedPasswords,
	})
	console.log(`-> Created ${usersToCreate.length} users.`)

	console.log('-> Creating a batch...')
	const batch = await prisma.batch.create({
		data: {
			batch_number: 'B2025-01',
			start_date: new Date('2025-01-15T00:00:00Z'),
			supervisorId: supervisorId,
			status: Status.ONGOING,
		},
	})
	console.log(`-> Created batch "${batch.batch_number}".`)

	console.log('-> Creating interns...')
	const intern1 = await prisma.intern.create({
		data: {
			user_id: internUser1Id,
			batch_id: batch.id,
			first_name: 'Heriel Kaye',
			last_name: 'Paculba',
			school: 'Negros Oriental State University',
			required_hours: 300,
			status: Status.ONGOING,
			course: 'BS Computer Engineering',
			year: '4th',
			contact_number: '111-222-3333',
			emergency_contact_person: 'Kaye Paculba',
			emergency_contact_number: '111-222-3334',
			role: 'Software Developer',
			intern_picture: 'a-girl-s-face-with-a-beautiful-smile-a-female-avatar-for-a-website-and-social-network-vector.jpg',
		},
	})
	const intern2 = await prisma.intern.create({
		data: {
			user_id: internUser2Id,
			batch_id: batch.id,
			first_name: 'John',
			last_name: 'Doe',
			school: 'City College',
			required_hours: 300,
			status: Status.ONGOING,
			course: 'BS Computer Engineering',
			year: '4th',
			contact_number: '444-555-6666',
			emergency_contact_person: 'Mary Doe',
			emergency_contact_number: '444-555-6667',
			role: 'Software Developer',
			intern_picture: 'cheerful-boy-with-cute-avatar-over-white-vector.jpg',
		},
	})
	console.log(`-> Created interns: "${intern1.first_name}" and "${intern2.first_name}".`)

	console.log('-> Creating pending time logs...')
	const logsData = []
	const internsToLog = [intern1.id, intern2.id]
	const BREAK_HOURS = 1

	for (const internId of internsToLog) {
		for (let i = 1; i <= 3; i++) {
			const logDate = new Date()
			logDate.setDate(logDate.getDate() - i * 2) // Create logs for previous days

			const timeIn = new Date(logDate)
			timeIn.setHours(9, 0, 0, 0) // 9:00 AM

			const timeOut = new Date(logDate)
			timeOut.setHours(18, 0, 0, 0) // 6:00 PM

			const durationMs = timeOut.getTime() - timeIn.getTime()
			const grossHours = durationMs / (1000 * 60 * 60)
			const netHours = Math.max(0, grossHours - BREAK_HOURS)

			logsData.push({
				intern_id: internId,
				time_in: timeIn,
				time_out: timeOut,
				total_hours: 0,
				status: false,
				admin_id: null,
			})
		}
	}

	await prisma.timeLog.createMany({
		data: logsData,
	})
	console.log(`-> Created ${logsData.length} pending time logs.`)

	console.log(`\nSeeding finished.`)
}

main()
	.catch(async (e) => {
		console.error('An error occurred during seeding:', e)
		process.exit(1)
	})
	.finally(async () => {
		console.log('Disconnecting Prisma Client...')
		await prisma.$disconnect()
	})

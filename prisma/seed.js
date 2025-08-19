import { PrismaClient } from '../app/generated/prisma/index.js'
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
	const internUser1Id = 'ada24d94-f49e-4af1-91f0-64056ad149ec'
	const internUser2Id = 'a7c4a8a0-2b1d-4f1e-9d6c-2e9b9c0a3b1d'
	const supervisorId = '015084bc-bec3-4373-aec3-729fba0a825a'

	const usersToCreate = [
		{
			id: '015084bc-bec3-4373-aec3-729fba0a825a',
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
			id: 'ada24d94-f49e-4af1-91f0-64056ad149eb',
			email: 'sheen.balatero@mllrdev.com',
			name: 'Sheen Balatero',
			password: 'mllrdev321',
			isAdmin: true,
		},
		{
			id: internUser1Id,
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
	const createdUsers = await prisma.user.createMany({
		data: usersWithHashedPasswords,
	})
	console.log(`-> Created ${createdUsers.count} users.`)

	console.log('-> Creating a batch...')
	const batch = await prisma.batch.create({
		data: {
			batch_number: 'B2025-01',
			start_date: new Date('2025-01-15T00:00:00Z'),
			supervisorId: supervisorId,
			status: 'ONGOING',
		},
	})
	console.log(`-> Created batch "${batch.batch_number}".`)

	console.log('-> Creating interns...')
	const intern1 = await prisma.intern.create({
		data: {
			user_id: internUser1Id,
			batch_id: batch.id,
			school: 'Negros Oriental State University',
			required_hours: 300,
			status: 'ONGOING',
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
			school: 'City College',
			required_hours: 300,
			status: 'ONGOING',
			course: 'BS Computer Engineering',
			year: '4th',
			contact_number: '444-555-6666',
			emergency_contact_person: 'Mary Doe',
			emergency_contact_number: '444-555-6667',
			role: 'Software Developer',
			intern_picture: 'cheerful-boy-with-cute-avatar-over-white-vector.jpg',
		},
	})
	console.log(`-> Created interns.`)

	console.log('-> Creating pending time logs...')
	const logsData = []
	const internsToLog = [intern1.id, intern2.id]

	for (const internId of internsToLog) {
		for (let i = 1; i <= 3; i++) {
			const logDate = new Date()
			logDate.setDate(logDate.getDate() - i * 2)
			logsData.push({
				intern_id: internId,
				time_in: new Date(logDate.setHours(9, 0, 0, 0)),
				time_out: new Date(logDate.setHours(19, 0, 0, 0)),
				total_hours: 0,
				status: false,
				admin_id: null,
			})
		}
	}

	const timeLogs = await prisma.timeLog.createMany({
		data: logsData,
	})
	console.log(`-> Created ${timeLogs.count} pending time logs.`)

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

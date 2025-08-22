import { PrismaClient, Status } from '../app/generated/prisma/index.js'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const SALT_ROUNDS = 10

async function main() {
	const adminUsersData = [
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
	]

	const internsToCreate = [
		{
			userData: {
				id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
				email: 'test1@mllrdev.com',
				name: 'Harold Jan P. Besario',
				password: 'internpassword',
				isAdmin: false,
			},
			internData: {
				first_name: 'Harold Jan',
				middle_name: 'Parao',
				last_name: 'Besario',
				school: 'Negros Oriental State University',
				course: 'BS Computer Engineering',
				year: '4th Year',
				contact_number: '09971748081',
				emergency_contact_person: 'Yolanda Raganas',
				emergency_contact_number: '09069515334',
				required_hours: 300,
				hours_completed: 150.0,
				status: Status.INCOMING,
				role: 'UI/UX Designer',
				notes: null,
				intern_picture: '/uploads/1755444966541-harold.jpg',
			},
		},
		{
			userData: {
				id: 'a1b2c3d4-e5f6-7890-1234-567890abcpop',
				email: 'test2@mllrdev.com',
				name: 'Remejie Maano',
				password: 'internpassword',
				isAdmin: false,
			},
			internData: {
				first_name: 'Remejie',
				middle_name: null,
				last_name: 'Maano',
				school: 'Negros Oriental State University',
				course: 'BS Computer Engineering',
				year: '4th Year',
				contact_number: '09971748081',
				emergency_contact_person: 'Yolanda Raganas',
				emergency_contact_number: '09069515334',
				required_hours: 300,
				hours_completed: 150.0,
				status: Status.INCOMING,
				role: 'Web Developer',
				notes: null,
				intern_picture: null,
			},
		},
	]

	const hashedAdminUsers = await Promise.all(
		adminUsersData.map(async (user) => ({
			...user,
			password: await bcrypt.hash(user.password, SALT_ROUNDS),
		})),
	)

	await prisma.user.createMany({ data: hashedAdminUsers })
	const batch = await prisma.batch.create({
		data: {
			batch_number: '2025-Batch-01',
			start_date: new Date(),
			status: Status.INCOMING,
			supervisorId: adminUsersData[0].id,
		},
	})
	for (const intern of internsToCreate) {
		const hashedInternPassword = await bcrypt.hash(intern.userData.password, SALT_ROUNDS)
		const createdUser = await prisma.user.create({
			data: { ...intern.userData, password: hashedInternPassword },
		})
		await prisma.intern.create({
			data: {
				...intern.internData,
				user_id: createdUser.id,
				batch_id: batch.id,
			},
		})
	}
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async () => {
		await prisma.$disconnect()
		process.exit(1)
	})

import { PrismaClient } from '../app/generated/prisma/index.js'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

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
	];

	const internUserData = {
		id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
		email: 'intern.test@mllrdev.com',
		name: 'Test Intern',
		password: 'internpassword',
		isAdmin: false,
	};

	const hashedAdminUsers = await Promise.all(
		adminUsersData.map(async (user) => ({
			...user,
			password: await bcrypt.hash(user.password, SALT_ROUNDS),
		}))
	);
	await prisma.user.createMany({ data: hashedAdminUsers });

	const batch = await prisma.batch.create({
		data: {
			batch_number: '2025-Batch-01',
			start_date: new Date(),
		},
	});

	const hashedInternPassword = await bcrypt.hash(internUserData.password, SALT_ROUNDS);
	const internUser = await prisma.user.create({
		data: {
			...internUserData,
			password: hashedInternPassword,
		},
	});

	const internProfile = await prisma.intern.create({
		data: {
			user_id: internUser.id,
			batch_id: batch.id,
			school: 'University of Technology',
			course: 'Computer Science',
			year: '4th',
			contact_number: '123-456-7890',
			emergency_contact_person: 'Jane Doe',
			emergency_contact_number: '098-765-4321',
			required_hours: 300,
			status: true,
		},
	});


	const timeInValue = new Date();
	await prisma.timeLog.create({
		data: {
			intern: { connect: { id: internProfile.id } },
			user: { connect: { id: adminUsersData[0].id } },
			time_in: timeInValue,
			time_out: timeInValue,
			total_hours: 0,
			status: false,
		}
	});
}

main()
	.then(() => prisma.$disconnect())
	.catch(async (e) => {
		console.error("An error occurred during seeding:", e);
		await prisma.$disconnect();
		process.exit(1);
	});
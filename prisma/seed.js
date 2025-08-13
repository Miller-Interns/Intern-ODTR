import { PrismaClient } from '../app/generated/prisma/index.js'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

async function main() {
	const usersToCreate = [
		{
			//Alyssa Palencia
			id: '015084bc-bec3-4373-aec3-729fba0a825a',
			email: 'alyssa.palencia@mllrdev.com',
			name: 'Alyssa Palencia',
			password: 'mllrdev321',
			isAdmin: true,
		},
		{
			//Karl Zablan
			id: '0908da60-40f8-4b20-948c-dca792a64860',
			email: 'karl.zablan@mllrdev.com',
			name: 'Karl Zablan',
			password: 'mllrdev321',
			isAdmin: true,
		},
		{
			//Seth Cornelio
			id: 'cef438de-359c-4802-97ca-66d74dd50cf1',
			email: 'seth.cornelio@mllrdev.com',
			name: 'Seth Cornelio',
			password: 'mllrdev321',
			isAdmin: true,
		},
		{
			//Sheen Balatero
			id: 'ada24d94-f49e-4af1-91f0-64056ad149eb',
			email: 'sheen.balatero@mllrdev.com',
			name: 'Sheen Balatero',
			password: 'mllrdev321',
			isAdmin: true,
		},
	];

	const usersWithHashedPasswords = await Promise.all(
		usersToCreate.map(async (user) => {
			const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

			return {
				...user,
				password: hashedPassword,
			};
		})
	);

	await prisma.user.createMany({
		data: usersWithHashedPasswords,
	});
}

main()
	.then(async () => {
		console.log('Disconnecting Prisma Client...');
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error('An error occurred during seeding:', e)
		await prisma.$disconnect()
		process.exit(1)
	})
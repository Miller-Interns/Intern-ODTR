import { PrismaClient } from '../app/generated/prisma/index.js'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
	const adminUsersData = [
		{ id: '015084bc-bec3-4373-aec3-729fba0a825a', email: 'alyssa.palencia@mllrdev.com', name: 'Alyssa Palencia', password: 'mllrdev321', isAdmin: true },
		{ id: '0908da60-40f8-4b20-948c-dca792a64860', email: 'karl.zablan@mllrdev.com', name: 'Karl Zablan', password: 'mllrdev321', isAdmin: true },
		{ id: 'cef438de-359c-4802-97ca-66d74dd50cf1', email: 'seth.cornelio@mllrdev.com', name: 'Seth Cornelio', password: 'mllrdev321', isAdmin: true },
		{ id: 'ada24d94-f49e-4af1-91f0-64056ad149eb', email: 'sheen.balatero@mllrdev.com', name: 'Sheen Balatero', password: 'mllrdev321', isAdmin: true },
	];
	
    const internsToCreate = [
        { 
            userData: { id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', email: 'intern.test@mllrdev.com', name: 'Harold Jan P. Besario', password: 'internpassword', isAdmin: false },
            internData: { 
                school: 'Negros Oriental State University', 
                course: 'BS Computer Engineering', 
                year: '4th Year', 
                contact_number: '09971748081', 
                emergency_contact_person: 'Yolanda Raganas', 
                emergency_contact_number: '09069515334', 
                required_hours: 300.0, 
                status: false, 
                hours_completed: 150.0,
                role: 'UI/UX Designer',
                notes: 'None'
            }
        },
        { 
            userData: { id: 'a1b2c3d4-e5f6-7890-1234-567890abcabf', email: 'intern.test2@mllrdev.com', name: 'Jane Doe', password: 'internpassword', isAdmin: false },
            internData: { 
                school: 'State College', 
                course: 'Information Systems', 
                year: '3rd', 
                contact_number: '111-222-3333', 
                emergency_contact_person: 'John Smith', 
                emergency_contact_number: '444-555-6666', 
                required_hours: 200.0, 
                status: false, 
                hours_completed: 0.0,
                role: 'Frontend Developer',
                notes: 'New intern, requires orientation.'
            }
        }
    ];

	const hashedAdminUsers = await Promise.all( adminUsersData.map(async (user) => ({ ...user, password: await bcrypt.hash(user.password, SALT_ROUNDS), })) );
	await prisma.user.createMany({ data: hashedAdminUsers });

	const batch = await prisma.batch.create({ data: { batch_number: '2025-Batch-01', start_date: new Date(), }, });

	for (const intern of internsToCreate) {
		const hashedInternPassword = await bcrypt.hash(intern.userData.password, SALT_ROUNDS);
		const createdUser = await prisma.user.create({ data: { ...intern.userData, password: hashedInternPassword, }, });
		await prisma.intern.create({ data: { ...intern.internData, user_id: createdUser.id, batch_id: batch.id, }, });
	}
}

main()
	.then(async () => {
		console.log("Seeding finished successfully.");
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error("An error occurred during seeding:", e);
		await prisma.$disconnect();
		process.exit(1);
	});
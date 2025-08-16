// FIX: Import from the project-specific generated client location
import { PrismaClient } from '../app/generated/prisma/index.js'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
	// --- DATA DEFINITIONS ---
	const adminUsersData = [ { id: '015084bc-bec3-4373-aec3-729fba0a825a', email: 'alyssa.palencia@mllrdev.com', name: 'Alyssa Palencia', password: 'mllrdev321', isAdmin: true }, { id: '0908da60-40f8-4b20-948c-dca792a64860', email: 'karl.zablan@mllrdev.com', name: 'Karl Zablan', password: 'mllrdev321', isAdmin: true }, { id: 'cef438de-359c-4802-97ca-66d74dd50cf1', email: 'seth.cornelio@mllrdev.com', name: 'Seth Cornelio', password: 'mllrdev321', isAdmin: true }, { id: 'ada24d94-f49e-4af1-91f0-64056ad149eb', email: 'sheen.balatero@mllrdev.com', name: 'Sheen Balatero', password: 'mllrdev321', isAdmin: true }, ];
	
    // Array of interns to create
    const internsToCreate = [
        { 
            userData: { id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', email: 'intern.test@mllrdev.com', name: 'Test Intern', password: 'internpassword', isAdmin: false },
            internData: { school: 'University of Technology', course: 'Computer Science', year: '4th', contact_number: '123-456-7890', emergency_contact_person: 'Jane Doe', emergency_contact_number: '098-765-4321', required_hours: 300.0, status: false, hours_completed: 50.0 }
        },
        { 
            userData: { id: 'a1b2c3d4-e5f6-7890-1234-567890abcabf', email: 'intern.test2@mllrdev.com', name: 'Test Intern 2', password: 'internpassword', isAdmin: false },
            internData: { school: 'State College', course: 'Information Systems', year: '3rd', contact_number: '111-222-3333', emergency_contact_person: 'John Smith', emergency_contact_number: '444-555-6666', required_hours: 300.0, status: false, hours_completed: 0.0 }
        }
    ];

	// --- SEEDING LOGIC ---

	// 1. Create Admins
	const hashedAdminUsers = await Promise.all( adminUsersData.map(async (user) => ({ ...user, password: await bcrypt.hash(user.password, SALT_ROUNDS), })) );
	await prisma.user.createMany({ data: hashedAdminUsers });

	// 2. Create a Batch
	const batch = await prisma.batch.create({ data: { batch_number: '2025-Batch-01', start_date: new Date(), }, });

	// 3. Loop through and create each intern and their profile
	for (const intern of internsToCreate) {
		const hashedInternPassword = await bcrypt.hash(intern.userData.password, SALT_ROUNDS);
		const createdUser = await prisma.user.create({
			data: {
				...intern.userData,
				password: hashedInternPassword,
			},
		});

		await prisma.intern.create({
			data: {
				...intern.internData,
				user_id: createdUser.id,
				batch_id: batch.id,
			},
		});
	}
}

main()
	.then(async () => {
		console.log("Seeding finished successfully. Multiple test interns created.");
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error("An error occurred during seeding:", e);
		await prisma.$disconnect();
		process.exit(1);
	});
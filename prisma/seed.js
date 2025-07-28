import { PrismaClient } from '../app/generated/prisma'
const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  console.log('-> Deleting existing data...');
  await prisma.timeLog.deleteMany();
  await prisma.intern.deleteMany();
  await prisma.user.deleteMany();
  await prisma.batch.deleteMany();
  console.log('-> Existing data deleted.');

  console.log('-> Creating users...');
  const users = await prisma.user.createMany({
    data: [
      {
        // Alyssa Palencia (Admin)
        id: '015084bc-bec3-4373-aec3-729fba0a825a',
        email: 'alyssa.palencia@mllrdev.com',
        name: 'Alyssa Palencia',
        password: 'mllrdev321', 
        isAdmin: true,
      },
      {
        // Karl Zablan (Admin)
        id: '0908da60-40f8-4b20-948c-dca792a64860',
        email: 'karl.zablan@mllrdev.com',
        name: 'Karl Zablan',
        password: 'mllrdev321',
        isAdmin: true,
      },
      {
        // Seth Cornelio (Admin)
        id: 'cef438de-359c-4802-97ca-66d74dd50cf1',
        email: 'seth.cornelio@mllrdev.com',
        name: 'Seth Cornelio',
        password: 'mllrdev321',
        isAdmin: true,
      },
      {
        // Sheen Balatero (Admin)
        id: 'ada24d94-f49e-4af1-91f0-64056ad149eb',
        email: 'sheen.balatero@mllrdev.com',
        name: 'Sheen Balatero',
        password: 'mllrdev321',
        isAdmin: true,
      },

	  //for testing purposes only

      {
        // Heriel Kaye Paculba (Intern User 1)
        id: 'ada24d94-f49e-4af1-91f0-64056ad149ec',
        email: 'paculba.herielkaye@gmail.com',
        name: 'Heriel Kaye Paculba',
        password: 'test321',
        isAdmin: false,
      },
      {
        // John Doe (Intern User 2)
        id: 'a7c4a8a0-2b1d-4f1e-9d6c-2e9b9c0a3b1d',
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: 'test321',
        isAdmin: false,
      },
    ],
  });
  console.log(`-> Created ${users.count} users.`);

  console.log('-> Creating a batch...');
  const batch = await prisma.batch.create({
    data: {
      id: 'b2025-01-batch-id',
      batch_number: 'B2025-01',
      start_date: new Date('2025-01-15T00:00:00Z'),
      status: true,
    },
  });
  console.log(`-> Created batch "${batch.batch_number}".`);

  console.log('-> Creating interns...');
  const intern1 = await prisma.intern.create({
    data: {
      id: 'intern-heriel-paculba-id',
      user_id: 'ada24d94-f49e-4af1-91f0-64056ad149ec', 
      batch_id: batch.id,
      school: 'University of Technology',
      course: 'BS Information Systems',
      year: '4th',
      contact_number: '111-222-3333',
      emergency_contact_person: 'Jane Paculba',
      emergency_contact_number: '111-222-3334',
      required_hours: 500,
      status: true,
    },
  });
  const intern2 = await prisma.intern.create({
    data: {
      id: 'intern-john-doe-id',
      user_id: 'a7c4a8a0-2b1d-4f1e-9d6c-2e9b9c0a3b1d', 
      batch_id: batch.id,
      school: 'City College',
      course: 'BS Computer Engineering',
      year: '4th',
      contact_number: '444-555-6666',
      emergency_contact_person: 'Mary Doe',
      emergency_contact_number: '444-555-6667',
      required_hours: 500,
      status: true,
    },
  });
  console.log(`-> Created interns: ${intern1.id} and ${intern2.id}.`);

  console.log('-> Creating pending time logs...');
  const adminIdForLogs = '015084bc-bec3-4373-aec3-729fba0a825a'; 

  const logsData = [];
  const internsToLog = [intern1.id, intern2.id];

  for (const internId of internsToLog) {
    for (let i = 1; i <= 3; i++) {
      const logDate = new Date();
      logDate.setDate(logDate.getDate() - i * 2); 

	/*total hours calculation and overtime is set to zero,
	   updates when approve button is clicked 
	   (temporary as we don't have the logic in the user side yet)
	*/
	
    logsData.push({
    intern_id: internId,
    time_in: new Date(logDate.setHours(9, 0, 0, 0)), 
    time_out: new Date(logDate.setHours(19, 0, 0, 0)), 
    total_hours: 0,
    overtime: 0,
    remarks: null, 
    status: false, 
    admin_id: adminIdForLogs,
  });
    }
  }

  const timeLogs = await prisma.timeLog.createMany({
    data: logsData,
  });
  console.log(`-> Created ${timeLogs.count} pending time logs.`);

  console.log(`\nSeeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
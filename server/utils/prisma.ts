// /server/utils/prisma.ts

import { PrismaClient, Status } from '~/generated/prisma'

const prisma = new PrismaClient()

prisma.$use(async (params, next) => {
  // --- ADD THIS LOG TO PROVE THE MIDDLEWARE IS RUNNING ---
  console.log(`[Prisma Middleware] Executing ${params.model}.${params.action}`);
  
  // Existing logic...
  if (params.model === 'Intern' && (params.action === 'update' || params.action === 'updateMany')) {
    const dataToUpdate = params.action === 'update' ? params.args.data : params.args.data;

    if (dataToUpdate.hours_completed && dataToUpdate.hours_completed > 0) {
      const internId = params.args.where.id;
      if (internId) {
        const intern = await prisma.intern.findUnique({
          where: { id: internId },
          select: { status: true }
        });

        if (intern && intern.status === Status.INCOMING) {
          console.log(`[Prisma Middleware] Intern ${internId}: Status changing from INCOMING to ONGOING.`);
          dataToUpdate.status = Status.ONGOING;
        }
      }
    }
  }

  return next(params);
});

export default prisma;
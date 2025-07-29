
// import { prisma } from '~/server/db/db';
// import { Prisma } from '@prisma/client';
// import { z } from 'zod';
// import type { BatchApiResponse } from '~/interfaces/batch-response';
// import { Status } from "@prisma/client";


// const batchInputSchema = z.object({
//   batch_number: z.string().trim(),
//   start_date: z.string(),
//   status: z.enum([Status.INCOMING, Status.ONGOING]), 
// });


// export default defineEventHandler(async (event): Promise<BatchApiResponse> => {
//   const body = await readValidatedBody(event, (bodyToValidate) => 
//     batchInputSchema.safeParse(bodyToValidate)
//   );

//   if (!body.success) {
//     throw createError({
//       statusCode: 400, 
//       statusMessage: body.error.issues.map(issue => issue.message).join('. '),
//     });
//   }

//   const batchData = {
//     batch_number: body.data.batch_number,
//     start_date: new Date(body.data.start_date),
//   };

//   try {
//     const newBatch = await prisma.batch.create({ 
//       data: batchData,
//       select: {
//         id: true,
//         batch_number: true,
//         start_date: true,
//         status: true
//       }
//     });
    

//     setResponseStatus(event, 201); 

//     return {
//       success: true,
//       batch: newBatch,
//     };

//   } catch (e) {

//     if (e instanceof Prisma.PrismaClientKnownRequestError) {

//       if (e.code === 'P2002') {
//         throw createError({
//           statusCode: 409,
//           statusMessage: `A batch with the number "${batchData.batch_number}" already exists.`,
//         });
//       }
//     }
    

//     console.error('Failed to create batch:', e);
//     throw createError({
//       statusCode: 500, 
//       statusMessage: 'An unexpected error occurred on the server.',
//     });
//   }
// });

import { prisma } from '~/server/db/db';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import type { BatchApiResponse } from '~/interfaces/batch-response';
import { Status } from "@prisma/client";


const batchInputSchema = z.object({
  batch_number: z.string().trim(),
  start_date: z.string(),
  status: z.enum([Status.INCOMING, Status.ONGOING]), 
});



export default defineEventHandler(async (event): Promise<BatchApiResponse> => {
  const body = await readValidatedBody(event, (bodyToValidate) => 
    batchInputSchema.safeParse(bodyToValidate)
  );

  if (!body.success) {
    throw createError({
      statusCode: 400, 
      statusMessage: body.error.issues.map(issue => issue.message).join('. '),
    });
  }


  const { batch_number, start_date, status } = body.data;


  const prismaData = {
    batch_number,
    start_date: new Date(start_date), 
    status, 
  };


  try {
    const newBatch = await prisma.batch.create({ 
      data: prismaData, 
      select: {
        id: true,
        batch_number: true,
        start_date: true,
        status: true 
      }
    });
    
    setResponseStatus(event, 201); 

    return {
      success: true,
      batch: newBatch,
    };

  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') { 
        throw createError({
          statusCode: 409,
          statusMessage: `A batch with the number "${batch_number}" already exists.`,
        });
      }
    }
    
    console.error('Failed to create batch:', e);
    throw createError({
      statusCode: 500, 
      statusMessage: 'An unexpected error occurred on the server.',
    });
  }
});
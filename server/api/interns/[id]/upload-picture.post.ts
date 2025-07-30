
import { PrismaClient } from '~/generated/prisma';
import fs from 'node:fs/promises';
import path from 'node:path';

const prisma = new PrismaClient();

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'avatars');

export default defineEventHandler(async (event) => {
  const internId = getRouterParam(event, 'id') as string;

  if (!internId) {
    throw createError({ statusCode: 400, statusMessage: 'Intern ID is missing.' });
  }

  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const files = await readMultipartFormData(event);
    const uploadedFile = files?.find(file => file.name === 'avatar'); 

    if (!uploadedFile || !uploadedFile.filename || uploadedFile.data.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No file uploaded or file is empty.' });
    }

    const fileExtension = path.extname(uploadedFile.filename);
    const uniqueFilename = `${internId}-${Date.now()}${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);

    await fs.writeFile(filePath, uploadedFile.data);

    const publicImageUrl = `/uploads/avatars/${uniqueFilename}`;

    const updatedIntern = await prisma.intern.update({
      where: { id: internId },
      data: {
        intern_picture: publicImageUrl,
      },
    });

    console.log(`Successfully uploaded picture for intern ${internId}. Path: ${publicImageUrl}`);

    return { imageUrl: publicImageUrl };

  } catch (error: any) {
    console.error(`Failed to upload picture for intern ${internId}:`, error);
    throw createError({ 
      statusCode: error.statusCode || 500, 
      statusMessage: error.statusMessage || 'Could not upload picture.' 
    });
  }
});
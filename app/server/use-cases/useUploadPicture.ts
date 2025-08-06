import { saveAvatar } from '~/server/services/picture-storage.service';
import { updateInternPictureUrl } from '~/server/services/intern.service';

type UploadedFile = {
  name?: string;
  filename?: string;
  data: Buffer;
};

export async function uploadInternPictureUseCase(internId: string, uploadedFile: UploadedFile | undefined) {
  if (!internId) {
    throw createError({ statusCode: 400, statusMessage: 'Intern ID is missing.' });
  }

  if (!uploadedFile || !uploadedFile.filename || uploadedFile.data.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded or file is empty.' });
  }

  const publicImageUrl = await saveAvatar(uploadedFile.data, uploadedFile.filename, internId);

  await updateInternPictureUrl(internId, publicImageUrl);
  
  console.log(`Successfully updated picture URL in DB for intern ${internId}.`);

  return { imageUrl: publicImageUrl };
}
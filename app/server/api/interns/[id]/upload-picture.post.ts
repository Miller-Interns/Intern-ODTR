import { uploadInternPictureUseCase } from '~/server/use-cases/useUploadPicture';

export default defineEventHandler(async (event) => {
  const internId = getRouterParam(event, 'id') as string;

  try {
    const files = await readMultipartFormData(event);
    const uploadedFile = files?.find(file => file.name === 'avatar');

    const result = await uploadInternPictureUseCase(internId, uploadedFile);

    return result;

  } catch (error: any) {
    console.error(`Failed to upload picture for intern ${internId}:`, error);

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Could not upload picture.',
    });
  }
});
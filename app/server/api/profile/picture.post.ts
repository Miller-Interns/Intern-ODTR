// Create new file: app/server/api/profile/picture.post.ts

import { checkAuthentication } from '~/server/utils/check-authentication';
import { userService } from '~/server/service/user.service';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';

export default defineEventHandler(async (event) => {
    const userId = await checkAuthentication(event.context);

    // 1. Read the multipart form data from the request
    const formData = await readMultipartFormData(event);
    const pictureFile = formData?.find(part => part.name === 'picture');

    if (!pictureFile || !pictureFile.filename || pictureFile.data.length === 0) {
        throw createError({ statusCode: 400, message: 'No picture file was provided.' });
    }

    // 2. Create a unique filename to prevent overwrites
    const uniqueFilename = `${Date.now()}-${pictureFile.filename}`;
    
    // 3. Define the public URL path and the server's filesystem path
    const publicPath = `/uploads/${uniqueFilename}`;
    const storagePath = resolve(process.cwd(), `public${publicPath}`);

    try {
        // 4. Write the file to the server's public/uploads directory
        await writeFile(storagePath, pictureFile.data);

        // 5. Update the user's profile in the database with the new public path
        await userService.updateInternPicture(userId, publicPath, event.context);

        return { status: 'success', newPictureUrl: publicPath };
    } catch (error) {
        console.error('Error saving uploaded file:', error);
        throw createError({ statusCode: 500, message: 'Could not save the uploaded picture.' });
    }
});
import { checkAuthentication } from '~/server/utils/check-authentication'
import { userService } from '~/server/service/user.service'
import { writeFile } from 'fs/promises'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
	const userId = await checkAuthentication(event.context)
	const formData = await readMultipartFormData(event)
	const pictureFile = formData?.find((part) => part.name === 'picture')

	if (!pictureFile || !pictureFile.filename || pictureFile.data.length === 0) {
		throw createError({ statusCode: 400, message: 'No picture file was provided.' })
	}

	const uniqueFilename = `${Date.now()}-${pictureFile.filename}`
	const publicPath = `/uploads/avatars/${uniqueFilename}`
	const storagePath = resolve(process.cwd(), `public${publicPath}`)

	try {
		await writeFile(storagePath, pictureFile.data)
		await userService.updateInternPicture(userId, publicPath, event.context)

		return { status: 'success', newPictureUrl: publicPath }
	} catch (error) {
		console.error('Error saving uploaded file:', error)
		throw createError({ statusCode: 500, message: 'Could not save the uploaded picture.' })
	}
})

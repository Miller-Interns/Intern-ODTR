import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { internService } from '~/server/service/crud-for-interns/interns/intern.service'

export default defineEventHandler(async (event) => {
  const internId = getRouterParams(event).id
  const formData = await readMultipartFormData(event)
  const file = formData?.find(item => item.name === 'picture')

  if (!file || !file.data || !file.filename) {
    throw createError({ statusCode: 400, statusMessage: 'No picture provided.' })
  }

  const fileExtension = file.filename.split('.').pop()
  const uniqueFilename = `avatar-${internId}-${Date.now()}.${fileExtension}`
  const publicPath = `/uploads/avatars/${uniqueFilename}`
  const diskPath = resolve(`./public${publicPath}`)

  await writeFile(diskPath, file.data)
  return internService.updateInternPicture(internId, publicPath)
})
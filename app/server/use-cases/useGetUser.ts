import { PrismaClient } from '@prisma/client'
import type { H3Event } from 'h3'

const prisma = new PrismaClient()

export const getCurrentUser = async (event: H3Event) => {
    const userContext = event.context.user

    if (!userContext) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized: No valid session found.',
        })
    }

    const user = await prisma.user.findUnique({
        where: { id: userContext.userId },
        select: {
            id: true,
            name: true,
        },
    })

    if (!user) {
        throw createError({
            statusCode: 404,
            statusMessage: 'User not found.',
        })
    }

    return user
}

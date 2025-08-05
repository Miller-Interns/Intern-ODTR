import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { loginSchema } from './auth.schema'
import type { H3Event } from 'h3'

const prisma = new PrismaClient()

export async function loginUseCase(event: H3Event) {
    const body = await readBody(event)

    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid credentials',
            data: parsed.error.flatten(),
        })
    }

    const { email, password } = parsed.data
    const jwtSecret = process.env.JWT_SECRET

    if (!jwtSecret) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Server misconfiguration',
        })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Incorrect email or password',
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Incorrect email or password',
        })
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
        expiresIn: '12h',
    })

    setCookie(event, 'auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 12,
        path: '/',
    })

    return {
        status: 'ok',
        message: 'Logged in successfully',
    }
}

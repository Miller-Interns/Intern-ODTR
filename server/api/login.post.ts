import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { email, password } = await readBody(event);
    const jwtSecret = process.env.JWT_SECRET;

    if (!email || !password || !jwtSecret) {
        throw createError({ statusCode: 400, message: 'Invalid credentials or server configuration' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
        throw createError({ statusCode: 401, message: 'Incorrect email or password', statusMessage: 'Incorrect email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw createError({ statusCode: 401, message: 'Incorrect email or password', statusMessage: 'Incorrect email or password' });
    }

    const payload = {
        userId: user.id,
        email: user.email,
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '12h' });

    setCookie(event, 'auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 12, // 12 hours
        path: '/',
    });

    return { status: 'ok', message: 'Logged in successfully' };
});
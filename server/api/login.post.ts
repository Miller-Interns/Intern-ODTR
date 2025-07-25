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

    // 1. Find the user by their email
    const user = await prisma.user.findUnique({ where: { email } });
    // 2. Check if the user exists and has a password
    if (!user || !user.password) { // Assuming your field is named 'hashed_password'
        // Note: We use the same generic error message to prevent "user enumeration,"
        // which is telling an attacker whether an email exists in the system.
        throw createError({ statusCode: 401, message: 'Incorrect email or password' });
    }

    // 3. Verify the password (this code now only runs if user.hashed_password is a string)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw createError({ statusCode: 401, message: 'Incorrect email or password' });
    }

    // 4. Create JWT payload
    const payload = {
        userId: user.id,
        email: user.email,
    };

    // 5. Sign the token
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1d' });

    // 6. Set the cookie
    setCookie(event, 'auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 1,
        path: '/',
    });

    return { status: 'ok', message: 'Logged in successfully' };
});
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event);

    if (!email || !password) {
      throw createError({ statusCode: 400, message: 'Email and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    return { id: user.id, email: user.email };

  } catch (error: any) {
    console.error("REGISTER API ERROR:", error);

    if (error.code === 'P2002') {
      throw createError({ statusCode: 409, message: 'Email already in use' });
    }

    throw createError({ statusCode: 500, message: 'An error occurred' });
  }
});
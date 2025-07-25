import { PrismaClient } from '../../generated/prisma'
import { Kysely } from 'kysely'
import { PrismaKyselyDialect } from 'prisma-kysely'

// Import the Kysely types that prisma-kysely generated
import type { DB } from "../db/types";

// Create a single Prisma client instance
const prismaClient = new PrismaClient()

// Create the Kysely instance using the Prisma dialect
export const db = new Kysely<DB>({
  dialect: new PrismaKyselyDialect({
    prisma: prismaClient,
  }),
})
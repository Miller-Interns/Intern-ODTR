import { db } from "~/server/db";
import {z} from 'zod'

const updateBatchSchema=z.object ({
    start_date: z.string().transform((string)=>new Date(string)),
    status: z.string().min
})
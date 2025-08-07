import { db } from '~/server/db';

export default defineEventHandler((event) => {
    event.context.db = db;
});
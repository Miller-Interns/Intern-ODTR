/* eslint-disable  @typescript-eslint/no-explicit-any */

import { ZodError, ZodType } from 'zod'

function assertIsZodObject<T = any>(err: any): asserts err is ZodError<T> {
	if (!(err instanceof ZodError)) {
		throw err
	}
}

export const createSchemaValidator =
	(schema: ZodType) =>
	async <T extends Record<string, any>>(data: T): Promise<T> => {
		try {
			return schema.parse(data) as T
		} catch (err) {
			assertIsZodObject(err)

			throw createError({ statusCode: 500, data: { payload: err } })
		}
	}

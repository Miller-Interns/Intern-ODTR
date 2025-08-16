import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import z from 'zod'
import { createSchemaValidator } from '../utils/create-schema-validator'
import { userService } from '../service/user.service'
import { timeLogService } from '../service/timelog.service'
import type { RequestContext } from '../types/RequestContext'
import type { User } from '../db/types'
import type { Selectable } from 'kysely'
import { db } from '../db'
import { randomUUID } from 'node:crypto'

const dtoSchema = z.object({
	email: z.string(),
	password: z.string().min(6).max(100),
})
const validateDTO = createSchemaValidator(dtoSchema)
type LoginDTO = z.infer<typeof dtoSchema>

type LoginResult = {
	token: string
	user: Selectable<User>
}

export async function loginUseCase(dto: LoginDTO, context: RequestContext): Promise<LoginResult> {
	const { email, password } = await validateDTO(dto)
	const config = useRuntimeConfig()
	const jwtSecret = config.JWT_SECRET

	if (!jwtSecret) { throw createError({ statusCode: 500, statusMessage: 'Server misconfiguration' }) }

	const user = await userService.getUserByEmail(email, context)
	if (!user || !user.password) { throw createError({ statusCode: 401, statusMessage: 'User does not exist' }) }

	const isPasswordValid = await bcrypt.compare(password, user.password)
	if (!isPasswordValid) { throw createError({ statusCode: 401, statusMessage: 'Incorrect email or password' }) }

	// Automatic time-in and status activation logic
	if (!user.isAdmin) {
		const internProfile = await userService.getInternByUserId(user.id, context);
		if (internProfile) {
			const activeLog = await timeLogService.getActiveTimeLogByInternId(internProfile.id, context);
			
			// Only proceed if the intern is not already timed in.
			if (!activeLog) {
				const qb = (context.trx ??= db);
				
				// This is their very first time logging in. Activate them and time them in.
				if (internProfile.status === false) {
					// To confirm it's their first time, we check if they have any logs at all.
					const anyPreviousLogs = await qb.selectFrom('time_logs').select('id').where('intern_id', '=', internProfile.id).limit(1).executeTakeFirst();
					
					if (!anyPreviousLogs) {
						// Create the new time log record
						await qb.insertInto('time_logs').values({
							id: randomUUID(),
							intern_id: internProfile.id,
							time_in: new Date(),
							time_out: null,
							total_hours: 0,
							status: false,
						}).execute();

						// Update their status to true to mark them as "active".
						await qb
							.updateTable('interns')
							.set({ status: true })
							.where('id', '=', internProfile.id)
							.execute();
					}
					// If status is false but they have previous logs, it means they were deactivated. Do nothing.
				} 
				// This is a subsequent login for an already active intern.
				else if (internProfile.status === true) {
					await qb.insertInto('time_logs').values({
						id: randomUUID(),
						intern_id: internProfile.id,
						time_in: new Date(),
						time_out: null,
						total_hours: 0,
						status: false,
					}).execute();
				}
			}
		}
	}

	const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, { expiresIn: '12h' })

	return {
		token,
		user,
	}
}
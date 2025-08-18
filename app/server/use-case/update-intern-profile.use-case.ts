import z from 'zod'
import { checkAuthentication } from '../utils/check-authentication'
import { createSchemaValidator } from '../utils/create-schema-validator'
import { userService } from '../service/user.service'
import { createUpdateProfileResponse } from '../response/update-profile.response' // Import the new response formatter
import type { RequestContext } from '../types/RequestContext'

const dtoSchema = z.object({
	first_name: z.string().min(1, 'First name is required'),
	middle_name: z.string().optional(),
	last_name: z.string().min(1, 'Last name is required'),
	email: z.string().email(),
	password: z.string().min(6).optional().or(z.literal('')),
	contact_number: z.string(),
	emergency_contact_person: z.string(),
	emergency_contact_number: z.string(),
	school: z.string(),
	course: z.string(),
	year: z.string(),
	required_hours: z.number(),
	role: z.string().optional(),
	notes: z.string().optional(),
})
const validateDTO = createSchemaValidator(dtoSchema)
type UpdateProfileDTO = z.infer<typeof dtoSchema>

/**
 * This use case orchestrates the process of updating an intern's profile information.
 */
export const updateInternProfileUseCase = async (dto: UpdateProfileDTO, context: RequestContext) => {
	// 1. Authenticate the user
	const userId = await checkAuthentication(context)

	// 2. Validate the incoming data
	const validatedData = await validateDTO(dto)

	// 3. Call the service to perform the database update
	await userService.updateUserProfile(userId, validatedData)

	// 4. Pass control to the response formatter to build the final API response
	return createUpdateProfileResponse()
}

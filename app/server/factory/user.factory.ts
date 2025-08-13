import { ResponseUserFullSchema, type ResponseUserFull } from '../response/current-user.response'

function toFullResponse(user: ResponseUserFull): ResponseUserFull {
	return ResponseUserFullSchema.parse(user)
}

export const userFactory = {
	toFullResponse,
}

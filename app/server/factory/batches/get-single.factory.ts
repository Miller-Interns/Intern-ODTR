import { ResponseUserFullSchema, type ResponseUserFull } from '~/server/response/batches/get-single.response'

function toFullResponse(user: ResponseUserFull): ResponseUserFull {
    return ResponseUserFullSchema.parse(user)
}

export const userFactory = {
    toFullResponse,
}

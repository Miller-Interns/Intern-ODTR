import { ResponseUserFullSchema, type ResponseUserFull } from '~/server/response/batches/get-single.response'

function toFullResponse(batch: ResponseUserFull): ResponseUserFull {
    return ResponseUserFullSchema.parse(batch)
}

export const userFactory = {
    toFullResponse,
}

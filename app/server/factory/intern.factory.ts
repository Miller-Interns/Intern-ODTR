import { InternDetailsResponseSchema, type InternDetailsResponse, } from '../response/intern-details.response'

function toDetailsResponse(data: InternDetailsResponse): InternDetailsResponse {
    return InternDetailsResponseSchema.parse(data)
}

export const internFactory = {
    toDetailsResponse,
}
import { internFactory } from '~/server/factory/intern.factory'
import { getInternDetails } from '~/server/use-case/interns/get-intern-details.use-case'
import type { RequestContext } from '~/server/types/RequestContext';

export default defineEventHandler(async (event) => {
    const params = getRouterParams(event)
    const internId = params.id

    if (!internId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Intern ID is required.',
        });
    }

    const useCaseContext: RequestContext = {
        auth: event.context.auth ?? {},
        trx: event.context.trx,
    };

    const dto = {
        internId: internId,
    }

    try {
        const internDetails = await getInternDetails(dto, useCaseContext)
        try {
            return internFactory.toDetailsResponse(internDetails)
        } catch (error) {
            console.error('Zod Parsing Error:', error);
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to parse intern details.',
                data: (error as any).issues
            });
        }
    } catch (error) {
        throw error;
    }
})

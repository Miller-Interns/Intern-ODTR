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

    console.log(`[API] Received request for intern ID:`, params.id);


    const useCaseContext: RequestContext = {
        auth: event.context.auth ?? {},
        trx: event.context.trx,
    };

    const dto = {
        internId: internId,
    }

    const internDetails = await getInternDetails(dto, useCaseContext)

    console.log('Data from getInternDetails:', JSON.stringify(internDetails, null, 2));

    try {
        const internDetails = await getInternDetails(dto, useCaseContext)

        console.log('Data from getInternDetails:', JSON.stringify(internDetails, null, 2));

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

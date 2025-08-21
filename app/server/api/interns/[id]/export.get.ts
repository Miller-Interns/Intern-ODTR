import type { RequestContext } from '~/server/types/RequestContext'
import { exportInternTimelogs } from '~/server/use-case/interns/export-intern-timelogs.use-case'
import { exportFactory } from '~/server/factory/export.factory';
import { formatTimelogsToCsv } from '~/server/utils/csv-formatter';

export default defineEventHandler(async (event) => {
	const params = getRouterParams(event);
	const internId = params.id;

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
	};

	try {
		const exportData = await exportInternTimelogs(dto, useCaseContext);

		let validatedData;
		try {
			validatedData = exportFactory.toExportResponse(exportData);
		} catch (error) {
			console.error('Zod Parsing Error:', error);
			throw createError({
				statusCode: 500,
				statusMessage: 'Failed to parse export data.',
				data: (error as any).issues
			});
		}

		const csvString = formatTimelogsToCsv(validatedData);
		const safeFilename = validatedData.intern.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
		const currentDate = new Date().toISOString().split('T')[0];

		setResponseHeaders(event, {
			'Content-Type': 'text/csv;charset=utf-8;',
			'Content-Disposition': `attachment; filename="timelogs_${safeFilename}_${currentDate}.csv"`,
		});
		return csvString;

	} catch (error: any) {
		console.error('Failed to export time logs:', error);
		throw error;
	}
});

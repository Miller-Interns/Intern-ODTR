import { ExportTimeLogsResponseSchema, type ExportTimeLogsResponse, } from '../response/export-logs.response'

function toExportResponse(data: ExportTimeLogsResponse): ExportTimeLogsResponse {
    return ExportTimeLogsResponseSchema.parse(data)
}

export const exportFactory = {
    toExportResponse,
}
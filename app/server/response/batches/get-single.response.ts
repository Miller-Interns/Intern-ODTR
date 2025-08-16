import { z } from 'zod'
import { BatchSchema } from '~/server/db/schema'

export const ResponseUserFullSchema = z.object({
    id: BatchSchema.shape.id,
})

export type ResponseUserFull = z.infer<typeof ResponseUserFullSchema>

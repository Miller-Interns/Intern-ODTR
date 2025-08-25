import { AdminViewArraySchema, type AdminUserFull } from '~/server/response/batches/get-admin.response'

function toAdminResponse(adminUsers: AdminUserFull[]):AdminUserFull[]{
    return AdminViewArraySchema.parse(adminUsers)
}

export const adminFactory = {
    toAdminResponse,
}

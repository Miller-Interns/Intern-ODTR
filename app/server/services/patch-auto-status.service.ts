import { db } from '~/server/db/index';


async function updateIncomingStatus() {
  const updatedBatches = await db
    .updateTable('batches')
    .set({ status: 'ONGOING' })
    .where((eb) =>
      eb.and([
        eb('status', '=', 'INCOMING'),
        eb('start_date', '<=', new Date()),
      ])
    )
    .returningAll()
    .execute();

  return updatedBatches;
}

export const BatchService = {
  updateIncomingStatus
};

import { type BatchDetailsView, BatchDetailsViewArraySchema } from "~/server/response/batches/get-batch.response";

function toViewArray(batches:BatchDetailsView[]): BatchDetailsView[] {
  return BatchDetailsViewArraySchema.parse(batches);
}

export const batchDetailsFactory = {
  toViewArray,
};
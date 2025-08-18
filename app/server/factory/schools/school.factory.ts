import { SchoolListResponseSchema, type SchoolListResponse } from '~/server/response/schools/school-list.response'

type RawSchoolData = {
  school: string | null;
}

function toSchoolListResponse(rawSchools: RawSchoolData[]): SchoolListResponse {

  const viewModel = rawSchools
    .filter(schoolObj => schoolObj.school !== null)
    .map(schoolObj => ({
      school: schoolObj.school as string,
    }));

  return SchoolListResponseSchema.parse(viewModel);
}

export const schoolFactory = {
  toSchoolListResponse,
}
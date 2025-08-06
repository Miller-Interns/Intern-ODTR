import { findUniqueSchools } from '~/server/services/school.service';

export async function getAllSchoolsUseCase() {
  const schoolObjects = await findUniqueSchools();

  const schoolNames = schoolObjects
    .map(item => item.school)
    .filter(school => school); 
    
  schoolNames.sort();

  return schoolNames;
}
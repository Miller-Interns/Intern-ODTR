import { db } from '~/server/db'

async function getDistinctSchoolNames() {
  return db.selectFrom('interns').select('school').distinct().orderBy('school', 'asc').execute()
}

export const schoolService = {
  getDistinctSchoolNames,
}
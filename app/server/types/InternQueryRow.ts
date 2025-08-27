import type { User, Batch, Intern } from '../db/types'
import type { Selectable } from 'kysely'

export type InternQueryRow = Selectable<Intern> & {
    name: User['name']
    email: User['email']
    batch_number: Batch['batch_number']
}
import type { Selectable } from 'kysely'
import type { User } from '~/types/User'
import type { Batch, Status } from '~/types/Batch'

export type Intern = {
	id: string;
	user_id: string;
	batch_id: string;
	school: string;
	required_hours: number;
	status: Status;
	course: string;
	year: string;
	contact_number: string;
	emergency_contact_person: string;
	emergency_contact_number: string;
	role: string;
	intern_picture: string | null;
	hours_completed: number | null;
	note: string | null;
};

export type InternWithDetails = Omit<Selectable<Intern>, 'hours_completed'> & {
	user: Pick<User, 'name' | 'email'>
	batch: Pick<Batch, 'batch_number'>
	completed_hours: number
	remaining_hours: number
}

export type ActiveInternRow = {
	id: Intern['id']
	user_id: Intern['user_id']
	batch_id: Intern['batch_id']
	required_hours: Intern['required_hours']
	intern_picture: Intern['intern_picture']
	status: Intern['status']
	name: User['name']
	email: User['email']
	batch_number: Batch['batch_number']
	completed_hours: number
}

export type InternSummary = {
	id: string
	user_id: string
	batch_id: string
	required_hours: number
	intern_picture: string | null
	status: Status

	user: {
		name: string | null
		email: string
	}
	batch: {
		batch_number: string
	}

	completed_hours: number
	remaining_hours: number
}

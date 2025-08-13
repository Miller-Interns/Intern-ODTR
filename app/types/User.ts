export type User = {
	id: string
	email: string
	name: string | null
	password: string | null
	isAdmin: boolean
	createdAt: Date
	updatedAt: Date
}

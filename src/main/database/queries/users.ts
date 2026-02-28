import { eq } from 'drizzle-orm'
import { getDb } from '../index'
import { users } from '../schema'
import type { NewUser, UpdateUser, User as DbUser } from '../schema'
import type { User } from '../../../shared/types'

function toIpcUser(user: DbUser): User {
  return {
    uuid: user.uuid,
    email: user.email,
    password: user.password,
    createdAt: user.createdAt
  }
}

export function getAllUsers(): User[] {
  return getDb().select().from(users).all().map(toIpcUser)
}

export function createUser(data: NewUser): User {
  const created = getDb().insert(users).values(data).returning().get()
  if (!created) throw new Error('Failed to create user')
  return toIpcUser(created)
}

export function updateUser(data: UpdateUser): User {
  const updated = getDb()
    .update(users)
    .set({ email: data.email, password: data.password })
    .where(eq(users.uuid, data.uuid))
    .returning()
    .get()

  if (!updated) throw new Error(`User not found: ${data.uuid}`)
  return toIpcUser(updated)
}

export function deleteUser(uuid: string): User {
  const deleted = getDb().delete(users).where(eq(users.uuid, uuid)).returning().get()

  if (!deleted) throw new Error(`User not found: ${uuid}`)
  return toIpcUser(deleted)
}

import { eq } from 'drizzle-orm'
import { getDb } from '../index'
import { users } from '../schema'
import type { NewUser, UpdateUser } from '../schema'

export function getAllUsers() {
  return getDb().select().from(users).all()
}

export function createUser(data: NewUser) {
  return getDb().insert(users).values(data).returning().get()
}

export function updateUser(data: UpdateUser) {
  return getDb()
    .update(users)
    .set({ email: data.email, password: data.password })
    .where(eq(users.uuid, data.uuid))
    .returning()
    .get()
}

export function deleteUser(uuid: string) {
  return getDb()
    .delete(users)
    .where(eq(users.uuid, uuid))
    .returning()
    .get()
}
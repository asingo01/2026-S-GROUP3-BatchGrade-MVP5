import type { User, NewUser, UpdateUser } from '../main/database/schema'

export interface UsersAPI {
  getAll: () => Promise<User[]>
  create: (data: NewUser) => Promise<User>
  update: (data: UpdateUser) => Promise<User>
  delete: (uuid: string) => Promise<User>
}
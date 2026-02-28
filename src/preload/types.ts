import type { User, NewUser, UpdateUser } from '../shared/types'

export type UsersAPI = {
  getAll: () => Promise<User[]>
  create: (data: NewUser) => Promise<User>
  update: (data: UpdateUser) => Promise<User>
  delete: (uuid: string) => Promise<User>
}

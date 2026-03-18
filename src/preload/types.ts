import type { User, NewUser, UpdateUser } from '../shared/types'
import type { GccInstallationInfo } from '../shared/compiler'

export type UsersAPI = {
  getAll: () => Promise<User[]>
  create: (data: NewUser) => Promise<User>
  update: (data: UpdateUser) => Promise<User>
  delete: (uuid: string) => Promise<User>
}

export type CompilerAPI = {
  getGccStatus: () => Promise<GccInstallationInfo>
  setGccPath: (filePath: string) => Promise<GccInstallationInfo>
}

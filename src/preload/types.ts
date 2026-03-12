import type {
  User,
  NewUser,
  UpdateUser,
  Assignment,
  NewAssignment,
  UpdateAssignment
} from '../shared/types'

export type UsersAPI = {
  getAll: () => Promise<User[]>
  create: (data: NewUser) => Promise<User>
  update: (data: UpdateUser) => Promise<User>
  delete: (uuid: string) => Promise<User>
}

export type AssignmentsAPI = {
  /**
   * @brief Get all assignments.
   */
  getAll: () => Promise<Assignment[]>

  /**
   * @brief Create an assignment.
   * @param data Assignment creation payload.
   * @return Promise resolving to the created assignment.
   */
  create: (data: NewAssignment) => Promise<Assignment>

  /**
   * @brief Update an assignment.
   * @param data Assignment update payload.
   * @return Promise resolving to the updated assignment.
   */
  update: (data: UpdateAssignment) => Promise<Assignment>

  /**
   * @brief Delete an assignment by UUID.
   * @param uuid UUID of the assignment to delete.
   * @return Promise resolving to the deleted assignment.
   */
  delete: (uuid: string) => Promise<Assignment>
}

/**
 * @brief Aggregate preload API exposed on window.api.
 */
export type AppAPI = {
  users: UsersAPI
  assignments: AssignmentsAPI
}
/**
 * types.ts
 *
 * Description:
 * This file defines shared TypeScript types used across the BatchGrade
 * application. These types ensure type safety and consistency between
 * the main process, renderer process, and database schemas.
 *
 * Exported Types:
 * - User: Represents a user entity with authentication and role information
 * - NewUser, UpdateUser: Database operation types for user management
 */

export type { NewUser, UpdateUser } from '../main/database/schema'

/**
 * User Type
 *
 * Represents a complete user entity in the BatchGrade system.
 * Contains all user information including authentication details,
 * role assignment, and metadata.
 */
export type User = {
  /** Unique identifier for the user */
  uuid: string
  /** User's email address (used for login) */
  email: string
  /** Hashed password for authentication */
  password: string
  /** User's role in the system (student or instructor) */
  role: 'student' | 'instructor'
  /** Unix timestamp of when the user was created */
  createdAt: number
}

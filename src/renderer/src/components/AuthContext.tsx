/**
 * AuthContext.tsx
 * 
 * Description:
 * This file defines the authentication context used throughout
 * the BatchGrade application. The context provides a centralized
 * mechanism for managing and accessing user authentication state.
 * 
 * The AuthContext allows any component within the applicaiton
 * to determine whether a user is currently logged in and access
 * basic user information such as email and role (student or
 * instructor).
 * 
 * The file exports:
 *  - AuthProvider
 *      a React context provider that stores and manages the 
 *      authentication state of the application
 *  - useAuth
 *      a custom hook that allows components to access authentication
 *      data and functions without directly interacting with the
 *      underlying React context API.
 * 
 * Responsibilities:
 *  • Track login status
 *  • Store authenticated user information
 *  • Provide login and logout functionality
 *  • Make authentication state globally accessible
 * 
 * This provider must wrap the application's routing structure
 * (see App.tsx) to ensure all pages have acces to authentication
 * state.
 */
import React, { createContext, useContext, useState, ReactNode } from 'react'

// Defines the structure of the authentication context.
// This ensures all consumers of the context know exactly what data and functions exists
interface AuthContextType {
  // Indicates whether a user is currently authenticated
  isLoggedIn: boolean
  // Stores information about the logged-in user
  user: { email: string; role: 'student' | 'instructor' } | null
  // Function used to authenticate a user
  login: (email: string, role: 'student' | 'instructor') => void
  // Function used to terminate the user's session
  logout: () => void
}

// Create the authentication context.
// Initially undefined so we can detect if it is used outside of provider
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom hook used to access the authentication context.
// This prevents components from needing to call useContext() directly.
export const useAuth = () => {
  const context = useContext(AuthContext)
  // safely check to ensure the hook is only used within an AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Defines the properties accepted by the AuthProvider
// 'childre' refers to any nested components wrapped by the provider
interface AuthProviderProps {
  children: ReactNode
}

// AuthProvider component that supplies authentication state
// and authentication functions to all 'child' components.
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // tracks whether a user is currently logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // stores the current user's email and role (or null if no user is logged in)
  const [user, setUser] = useState<{ email: string; role: 'student' | 'instructor' } | null>(null)
  // handles user login by updating authentication state
  // and storing the user's identifying information
  const login = (email: string, role: 'student' | 'instructor') => {
    setIsLoggedIn(true)
    setUser({ email, role })
  }
  // handles user logout by clearing authentication state
  // and removing stored user information
  const logout = () => {
    setIsLoggedIn(false)
    setUser(null)
  }
  // provides authentication state and functions to any component
  // wrapped inside this provider
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
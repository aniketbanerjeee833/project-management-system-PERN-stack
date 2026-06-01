import { createContext } from 'react'
import type { Role, User } from '../types'

export interface AuthContextType {
  user: User
  role: Role
  setRole: (role: Role) => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

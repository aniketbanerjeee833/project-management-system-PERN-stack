import React, { useState } from 'react'
import { AuthContext } from './AuthContext'
import type { Role } from '../types'
import { currentUsers } from '../data/mockData'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('admin')
  const user = currentUsers[role]

  return (
    <AuthContext.Provider value={{ user, role, setRole }}>
      {children}
    </AuthContext.Provider>
  )
}

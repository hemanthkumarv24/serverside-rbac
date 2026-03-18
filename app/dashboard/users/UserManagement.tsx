'use client'

import { useState } from 'react'
import type { Role } from '@/types'

interface UserData {
  id: string
  name: string | null
  email: string
  role: Role
}

interface UserManagementProps {
  users: UserData[]
  canAssignRole: boolean
}

export default function UserManagement({ users, canAssignRole }: UserManagementProps) {
  const [userList, setUserList] = useState(users)
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleRoleChange(userId: string, newRole: Role) {
    setUpdating(userId)
    setError(null)

    const res = await fetch(`/api/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to update role')
    } else {
      const updatedUser = await res.json()
      setUserList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: updatedUser.role } : u))
      )
    }
    setUpdating(null)
  }

  return (
    <div>
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {userList.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.name || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {canAssignRole ? (
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value as Role)
                      }
                      disabled={updating === user.id}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="VIEWER">VIEWER</option>
                      <option value="EDITOR">EDITOR</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    </select>
                  ) : (
                    <span className="uppercase text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      {user.role}
                    </span>
                  )}
                  {updating === user.id && (
                    <span className="ml-2 text-gray-400 text-xs">Updating...</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

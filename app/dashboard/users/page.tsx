import { auth } from '@/lib/auth'
import * as pageService from '@/services/pageService'
import type { Role } from '@/types'
import { redirect } from 'next/navigation'
import UserManagement from './UserManagement'

export default async function UsersPage() {
  const session = await auth()
  const userRole = session?.user?.role as Role

  if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
    redirect('/dashboard')
  }

  const users = await pageService.listUsers(userRole)

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>
      <UserManagement
        users={users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role as Role,
        }))}
        canAssignRole={userRole === 'SUPER_ADMIN'}
      />
    </div>
  )
}

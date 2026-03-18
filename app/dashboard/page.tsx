import { auth } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          Welcome, <strong>{session?.user?.name || session?.user?.email}</strong>!
        </p>
        <p className="text-gray-600 mt-2">
          Role: <span className="font-semibold uppercase">{session?.user?.role}</span>
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a
            href="/dashboard/pages"
            className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
          >
            <h3 className="font-semibold text-blue-900">Pages</h3>
            <p className="text-blue-700 text-sm mt-1">View and manage pages</p>
          </a>
          {(session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN') && (
            <a
              href="/dashboard/users"
              className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
            >
              <h3 className="font-semibold text-green-900">Users</h3>
              <p className="text-green-700 text-sm mt-1">Manage users and roles</p>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

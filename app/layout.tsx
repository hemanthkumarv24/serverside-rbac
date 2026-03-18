import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RBAC Page Builder',
  description: 'Server-side Role-Based Access Control with Page Builder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}

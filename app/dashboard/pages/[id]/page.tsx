import { auth } from '@/lib/auth'
import * as pageService from '@/services/pageService'
import type { Role } from '@/types'
import { notFound } from 'next/navigation'
import PageEditor from './PageEditor'

export default async function PageDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  const userRole = session?.user?.role as Role

  let page
  try {
    page = await pageService.getPage(params.id, userRole)
  } catch {
    return (
      <div className="px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">You do not have permission to view this page.</p>
        </div>
      </div>
    )
  }

  if (!page) {
    notFound()
  }

  const canEdit =
    (userRole === 'EDITOR' || userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') &&
    page.status !== 'PUBLISHED'
  const canPublish = (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') && page.status !== 'PUBLISHED'

  return (
    <PageEditor
      page={{
        id: page.id,
        title: page.title,
        content: page.content,
        status: page.status,
        previewToken: page.previewToken,
        authorId: page.authorId,
        publishedAt: page.publishedAt ? page.publishedAt.toISOString() : null,
        createdAt: page.createdAt.toISOString(),
        updatedAt: page.updatedAt.toISOString(),
      }}
      canEdit={canEdit}
      canPublish={canPublish}
    />
  )
}

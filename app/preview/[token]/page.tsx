import * as pageService from '@/services/pageService'
import { notFound } from 'next/navigation'
import { sanitizeContent } from '@/lib/utils/sanitize'

export default async function PreviewPage({
  params,
}: {
  params: { token: string }
}) {
  const page = await pageService.getPageByPreviewToken(params.token)

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-8">
          <p className="text-yellow-800 text-sm font-medium">
            ⚠️ Preview Mode — This page is not publicly published
          </p>
        </div>
        <article className="prose lg:prose-xl max-w-none">
          <h1>{page.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: sanitizeContent(page.content) }} />
        </article>
        <div className="mt-8 pt-8 border-t text-sm text-gray-500">
          <p>Author: {page.author?.name || page.author?.email}</p>
          <p>Last updated: {new Date(page.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}

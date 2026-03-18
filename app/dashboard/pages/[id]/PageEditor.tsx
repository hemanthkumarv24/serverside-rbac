'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PageData {
  id: string
  title: string
  content: string
  status: string
  previewToken: string | null
  authorId: string
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

interface PageEditorProps {
  page: PageData
  canEdit: boolean
  canPublish: boolean
}

export default function PageEditor({ page, canEdit, canPublish }: PageEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(page.title)
  const [content, setContent] = useState(page.content)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(page)

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSuccess(null)

    const res = await fetch(`/api/pages/${page.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to save')
    } else {
      setSuccess('Saved successfully!')
    }
    setSaving(false)
  }

  async function handlePreview() {
    setPreviewing(true)
    setError(null)
    const res = await fetch(`/api/pages/${page.id}/preview`, {
      method: 'POST',
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to generate preview')
    } else {
      const data = await res.json()
      setCurrentPage(data)
      setSuccess('Preview link generated!')
    }
    setPreviewing(false)
  }

  async function handlePublish() {
    setPublishing(true)
    setError(null)

    const res = await fetch(`/api/pages/${page.id}/publish`, {
      method: 'POST',
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to publish')
    } else {
      setSuccess('Page published!')
      router.refresh()
    }
    setPublishing(false)
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Page</h1>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              currentPage.status === 'PUBLISHED'
                ? 'bg-green-100 text-green-800'
                : currentPage.status === 'PREVIEW'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {currentPage.status}
          </span>
        </div>
        <a
          href="/dashboard/pages"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to pages
        </a>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            {canEdit ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 text-lg font-semibold">{title}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            {canEdit ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div
                className="prose max-w-none p-4 border rounded-md bg-gray-50"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            )}
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
            {success}
          </div>
        )}

        {currentPage.status === 'PREVIEW' && currentPage.previewToken && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-sm font-medium text-yellow-800">Preview Link:</p>
            <a
              href={`/preview/${currentPage.previewToken}`}
              target="_blank"
              className="text-sm text-blue-600 hover:underline break-all"
            >
              {`/preview/${currentPage.previewToken}`}
            </a>
          </div>
        )}

        <div className="flex space-x-3">
          {canEdit && (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              {currentPage.status !== 'PUBLISHED' && (
                <button
                  onClick={handlePreview}
                  disabled={previewing}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-600 disabled:opacity-50"
                >
                  {previewing ? 'Generating...' : 'Generate Preview'}
                </button>
              )}
            </>
          )}
          {canPublish && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
            >
              {publishing ? 'Publishing...' : 'Publish'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

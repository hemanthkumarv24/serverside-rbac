export type Role = 'VIEWER' | 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN'

export type PageStatus = 'DRAFT' | 'PREVIEW' | 'PUBLISHED'

export interface User {
  id: string
  name: string | null
  email: string
  role: Role
}

export interface Page {
  id: string
  title: string
  content: string
  status: PageStatus
  previewToken: string | null
  authorId: string
  author?: User
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface CreatePageInput {
  title: string
  content: string
}

export interface UpdatePageInput {
  title?: string
  content?: string
}

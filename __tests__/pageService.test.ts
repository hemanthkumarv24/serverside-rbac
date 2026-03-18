import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../repositories/pageRepository', () => ({
  createPage: vi.fn(),
  findPageById: vi.fn(),
  findAllPages: vi.fn(),
  updatePage: vi.fn(),
  publishPage: vi.fn(),
  setPreviewMode: vi.fn(),
  deletePage: vi.fn(),
  findAllUsers: vi.fn(),
  updateUserRole: vi.fn(),
  findPageByPreviewToken: vi.fn(),
}))

import * as pageRepo from '../repositories/pageRepository'
import * as pageService from '../services/pageService'

const mockPage = {
  id: 'page-1',
  title: 'Test Page',
  content: '<p>Hello</p>',
  status: 'DRAFT' as const,
  previewToken: null,
  authorId: 'user-1',
  author: { id: 'user-1', name: 'Test User', email: 'test@example.com', role: 'EDITOR' as const },
  publishedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('pageService - createDraft', () => {
  it('allows editor to create draft', async () => {
    vi.mocked(pageRepo.createPage).mockResolvedValueOnce(mockPage)
    const result = await pageService.createDraft('user-1', 'EDITOR', {
      title: 'Test',
      content: '<p>Content</p>',
    })
    expect(result).toBe(mockPage)
    expect(pageRepo.createPage).toHaveBeenCalledWith('user-1', {
      title: 'Test',
      content: '<p>Content</p>',
    })
  })

  it('throws for viewer trying to create draft', async () => {
    await expect(
      pageService.createDraft('user-1', 'VIEWER', {
        title: 'Test',
        content: '<p>Content</p>',
      })
    ).rejects.toThrow('Permission denied')
  })
})

describe('pageService - getPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('allows viewer to get published page', async () => {
    vi.mocked(pageRepo.findPageById).mockResolvedValueOnce({
      ...mockPage,
      status: 'PUBLISHED',
    })
    const result = await pageService.getPage('page-1', 'VIEWER')
    expect(result).not.toBeNull()
  })

  it('denies viewer access to draft page', async () => {
    vi.mocked(pageRepo.findPageById).mockResolvedValueOnce({
      ...mockPage,
      status: 'DRAFT',
    })
    await expect(pageService.getPage('page-1', 'VIEWER')).rejects.toThrow(
      'Permission denied'
    )
  })

  it('allows editor to view draft page', async () => {
    vi.mocked(pageRepo.findPageById).mockResolvedValueOnce({
      ...mockPage,
      status: 'DRAFT',
    })
    const result = await pageService.getPage('page-1', 'EDITOR')
    expect(result).not.toBeNull()
  })

  it('returns null when page not found', async () => {
    vi.mocked(pageRepo.findPageById).mockResolvedValueOnce(null)
    const result = await pageService.getPage('nonexistent', 'ADMIN')
    expect(result).toBeNull()
  })
})

describe('pageService - publishPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('allows admin to publish', async () => {
    vi.mocked(pageRepo.findPageById).mockResolvedValueOnce(mockPage)
    vi.mocked(pageRepo.publishPage).mockResolvedValueOnce({
      ...mockPage,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      previewToken: null,
    })
    const result = await pageService.publishPage('page-1', 'ADMIN')
    expect(result.status).toBe('PUBLISHED')
  })

  it('throws for editor trying to publish', async () => {
    await expect(
      pageService.publishPage('page-1', 'EDITOR')
    ).rejects.toThrow('Permission denied')
  })

  it('throws when page not found', async () => {
    vi.mocked(pageRepo.findPageById).mockResolvedValueOnce(null)
    await expect(
      pageService.publishPage('page-1', 'ADMIN')
    ).rejects.toThrow('Page not found')
  })
})

describe('pageService - editDraft', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('allows editor to edit draft', async () => {
    vi.mocked(pageRepo.findPageById).mockResolvedValueOnce(mockPage)
    vi.mocked(pageRepo.updatePage).mockResolvedValueOnce({
      ...mockPage,
      title: 'Updated Title',
    })
    const result = await pageService.editDraft('page-1', 'EDITOR', {
      title: 'Updated Title',
    })
    expect(result.title).toBe('Updated Title')
  })

  it('throws for viewer trying to edit', async () => {
    await expect(
      pageService.editDraft('page-1', 'VIEWER', { title: 'Updated' })
    ).rejects.toThrow('Permission denied')
  })

  it('throws when trying to edit published page', async () => {
    vi.mocked(pageRepo.findPageById).mockResolvedValueOnce({
      ...mockPage,
      status: 'PUBLISHED',
    })
    await expect(
      pageService.editDraft('page-1', 'EDITOR', { title: 'Updated' })
    ).rejects.toThrow('Cannot edit a published page')
  })
})

describe('pageService - updateUserRole', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('allows super-admin to assign roles', async () => {
    vi.mocked(pageRepo.updateUserRole).mockResolvedValueOnce({
      id: 'user-1',
      name: 'Test',
      email: 'test@example.com',
      role: 'ADMIN',
    })
    const result = await pageService.updateUserRole('SUPER_ADMIN', 'user-1', 'ADMIN')
    expect(result.role).toBe('ADMIN')
  })

  it('throws for admin trying to assign roles', async () => {
    await expect(
      pageService.updateUserRole('ADMIN', 'user-1', 'EDITOR')
    ).rejects.toThrow('Permission denied')
  })
})

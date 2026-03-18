import * as pageRepo from '@/repositories/pageRepository'
import { hasPermission, PERMISSIONS, assertPermission } from '@/lib/rbac'
import type { Role } from '@/types'
import type { CreatePageInput, UpdatePageInput } from '@/lib/validators/page'

export async function createDraft(
  userId: string,
  userRole: Role,
  data: CreatePageInput
) {
  assertPermission(userRole, PERMISSIONS.PAGE_CREATE)
  return pageRepo.createPage(userId, data)
}

export async function getPage(
  pageId: string,
  userRole: Role
) {
  const page = await pageRepo.findPageById(pageId)
  if (!page) return null

  if (page.status === 'PUBLISHED') {
    return page
  }

  if (page.status === 'PREVIEW') {
    if (!hasPermission(userRole, PERMISSIONS.PAGE_VIEW_PREVIEW)) {
      throw new Error('Permission denied: cannot view preview pages')
    }
    return page
  }

  // DRAFT
  if (!hasPermission(userRole, PERMISSIONS.PAGE_VIEW_DRAFT)) {
    throw new Error('Permission denied: cannot view draft pages')
  }

  return page
}

export async function getPageByPreviewToken(token: string) {
  const page = await pageRepo.findPageByPreviewToken(token)
  if (!page) return null
  if (page.status !== 'PREVIEW') return null
  return page
}

export async function listPages(userRole: Role) {
  if (hasPermission(userRole, PERMISSIONS.PAGE_VIEW_DRAFT)) {
    return pageRepo.findAllPages()
  }
  return pageRepo.findAllPages({ status: 'PUBLISHED' })
}

export async function editDraft(
  pageId: string,
  userRole: Role,
  data: UpdatePageInput
) {
  assertPermission(userRole, PERMISSIONS.PAGE_EDIT)

  const page = await pageRepo.findPageById(pageId)
  if (!page) throw new Error('Page not found')
  if (page.status === 'PUBLISHED') {
    throw new Error('Cannot edit a published page')
  }

  return pageRepo.updatePage(pageId, data)
}

export async function publishPage(pageId: string, userRole: Role) {
  assertPermission(userRole, PERMISSIONS.PAGE_PUBLISH)

  const page = await pageRepo.findPageById(pageId)
  if (!page) throw new Error('Page not found')

  return pageRepo.publishPage(pageId)
}

export async function previewPage(pageId: string, userRole: Role) {
  assertPermission(userRole, PERMISSIONS.PAGE_EDIT)

  const page = await pageRepo.findPageById(pageId)
  if (!page) throw new Error('Page not found')
  if (page.status === 'PUBLISHED') {
    throw new Error('Page is already published')
  }

  return pageRepo.setPreviewMode(pageId)
}

export async function deletePage(pageId: string, userRole: Role) {
  assertPermission(userRole, PERMISSIONS.PAGE_DELETE)
  return pageRepo.deletePage(pageId)
}

export async function listUsers(userRole: Role) {
  assertPermission(userRole, PERMISSIONS.USER_MANAGE)
  return pageRepo.findAllUsers()
}

export async function updateUserRole(
  actorRole: Role,
  userId: string,
  newRole: 'VIEWER' | 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN'
) {
  assertPermission(actorRole, PERMISSIONS.USER_ASSIGN_ROLE)
  return pageRepo.updateUserRole(userId, newRole)
}

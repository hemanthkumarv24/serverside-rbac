import { describe, it, expect } from 'vitest'
import {
  hasPermission,
  hasMinimumRole,
  assertPermission,
  getPermissions,
  PERMISSIONS,
  ROLES,
} from '../lib/rbac'
import type { Role } from '../types'

describe('RBAC - hasPermission', () => {
  it('viewer can view published pages', () => {
    expect(hasPermission('VIEWER', PERMISSIONS.PAGE_VIEW_PUBLISHED)).toBe(true)
  })

  it('viewer cannot create pages', () => {
    expect(hasPermission('VIEWER', PERMISSIONS.PAGE_CREATE)).toBe(false)
  })

  it('viewer cannot view draft pages', () => {
    expect(hasPermission('VIEWER', PERMISSIONS.PAGE_VIEW_DRAFT)).toBe(false)
  })

  it('editor can create pages', () => {
    expect(hasPermission('EDITOR', PERMISSIONS.PAGE_CREATE)).toBe(true)
  })

  it('editor can edit pages', () => {
    expect(hasPermission('EDITOR', PERMISSIONS.PAGE_EDIT)).toBe(true)
  })

  it('editor cannot publish pages', () => {
    expect(hasPermission('EDITOR', PERMISSIONS.PAGE_PUBLISH)).toBe(false)
  })

  it('editor cannot manage users', () => {
    expect(hasPermission('EDITOR', PERMISSIONS.USER_MANAGE)).toBe(false)
  })

  it('admin can publish pages', () => {
    expect(hasPermission('ADMIN', PERMISSIONS.PAGE_PUBLISH)).toBe(true)
  })

  it('admin can manage users', () => {
    expect(hasPermission('ADMIN', PERMISSIONS.USER_MANAGE)).toBe(true)
  })

  it('admin cannot assign roles', () => {
    expect(hasPermission('ADMIN', PERMISSIONS.USER_ASSIGN_ROLE)).toBe(false)
  })

  it('super-admin can do everything', () => {
    expect(hasPermission('SUPER_ADMIN', PERMISSIONS.PAGE_CREATE)).toBe(true)
    expect(hasPermission('SUPER_ADMIN', PERMISSIONS.PAGE_PUBLISH)).toBe(true)
    expect(hasPermission('SUPER_ADMIN', PERMISSIONS.USER_MANAGE)).toBe(true)
    expect(hasPermission('SUPER_ADMIN', PERMISSIONS.USER_ASSIGN_ROLE)).toBe(true)
  })
})

describe('RBAC - hasMinimumRole', () => {
  it('super-admin has minimum role of admin', () => {
    expect(hasMinimumRole('SUPER_ADMIN', 'ADMIN')).toBe(true)
  })

  it('admin does not have minimum role of super-admin', () => {
    expect(hasMinimumRole('ADMIN', 'SUPER_ADMIN')).toBe(false)
  })

  it('viewer does not have minimum role of editor', () => {
    expect(hasMinimumRole('VIEWER', 'EDITOR')).toBe(false)
  })

  it('editor has minimum role of viewer', () => {
    expect(hasMinimumRole('EDITOR', 'VIEWER')).toBe(true)
  })

  it('same role satisfies minimum role check', () => {
    expect(hasMinimumRole('ADMIN', 'ADMIN')).toBe(true)
  })
})

describe('RBAC - assertPermission', () => {
  it('does not throw when permission is granted', () => {
    expect(() =>
      assertPermission('ADMIN', PERMISSIONS.PAGE_PUBLISH)
    ).not.toThrow()
  })

  it('throws when permission is denied', () => {
    expect(() =>
      assertPermission('VIEWER', PERMISSIONS.PAGE_CREATE)
    ).toThrow('Permission denied')
  })

  it('throws with descriptive message', () => {
    expect(() =>
      assertPermission('EDITOR', PERMISSIONS.PAGE_PUBLISH)
    ).toThrow("role 'EDITOR' does not have permission 'PAGE_PUBLISH'")
  })
})

describe('RBAC - getPermissions', () => {
  it('returns correct permissions for viewer', () => {
    const perms = getPermissions('VIEWER')
    expect(perms).toContain(PERMISSIONS.PAGE_VIEW_PUBLISHED)
    expect(perms).not.toContain(PERMISSIONS.PAGE_CREATE)
  })

  it('returns correct permissions for editor', () => {
    const perms = getPermissions('EDITOR')
    expect(perms).toContain(PERMISSIONS.PAGE_CREATE)
    expect(perms).toContain(PERMISSIONS.PAGE_EDIT)
    expect(perms).not.toContain(PERMISSIONS.PAGE_PUBLISH)
  })

  it('returns all permissions for super-admin', () => {
    const perms = getPermissions('SUPER_ADMIN')
    expect(perms).toContain(PERMISSIONS.USER_ASSIGN_ROLE)
    expect(perms).toContain(PERMISSIONS.PAGE_PUBLISH)
  })
})

import type { Role } from '@/types'

export const ROLES = {
  VIEWER: 'VIEWER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const

const ROLE_HIERARCHY: Role[] = ['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']

export function hasMinimumRole(userRole: Role, requiredRole: Role): boolean {
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole)
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole)
  return userRoleIndex >= requiredRoleIndex
}

export const PERMISSIONS = {
  PAGE_CREATE: 'PAGE_CREATE',
  PAGE_EDIT: 'PAGE_EDIT',
  PAGE_PUBLISH: 'PAGE_PUBLISH',
  PAGE_VIEW_DRAFT: 'PAGE_VIEW_DRAFT',
  PAGE_VIEW_PREVIEW: 'PAGE_VIEW_PREVIEW',
  PAGE_VIEW_PUBLISHED: 'PAGE_VIEW_PUBLISHED',
  PAGE_DELETE: 'PAGE_DELETE',
  USER_MANAGE: 'USER_MANAGE',
  USER_ASSIGN_ROLE: 'USER_ASSIGN_ROLE',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  VIEWER: [PERMISSIONS.PAGE_VIEW_PUBLISHED],
  EDITOR: [
    PERMISSIONS.PAGE_VIEW_PUBLISHED,
    PERMISSIONS.PAGE_VIEW_DRAFT,
    PERMISSIONS.PAGE_VIEW_PREVIEW,
    PERMISSIONS.PAGE_CREATE,
    PERMISSIONS.PAGE_EDIT,
  ],
  ADMIN: [
    PERMISSIONS.PAGE_VIEW_PUBLISHED,
    PERMISSIONS.PAGE_VIEW_DRAFT,
    PERMISSIONS.PAGE_VIEW_PREVIEW,
    PERMISSIONS.PAGE_CREATE,
    PERMISSIONS.PAGE_EDIT,
    PERMISSIONS.PAGE_PUBLISH,
    PERMISSIONS.PAGE_DELETE,
    PERMISSIONS.USER_MANAGE,
  ],
  SUPER_ADMIN: [
    PERMISSIONS.PAGE_VIEW_PUBLISHED,
    PERMISSIONS.PAGE_VIEW_DRAFT,
    PERMISSIONS.PAGE_VIEW_PREVIEW,
    PERMISSIONS.PAGE_CREATE,
    PERMISSIONS.PAGE_EDIT,
    PERMISSIONS.PAGE_PUBLISH,
    PERMISSIONS.PAGE_DELETE,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.USER_ASSIGN_ROLE,
  ],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function getPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}

export function assertPermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(
      `Permission denied: role '${role}' does not have permission '${permission}'`
    )
  }
}

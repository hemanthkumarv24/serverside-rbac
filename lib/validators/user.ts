import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const updateUserRoleSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(['VIEWER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']),
})

export type LoginInput = z.infer<typeof loginSchema>
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>

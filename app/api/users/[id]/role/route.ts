import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { updateUserRoleSchema } from '@/lib/validators/user'
import * as pageService from '@/services/pageService'
import type { Role } from '@/types'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = updateUserRoleSchema.safeParse({ userId: params.id, ...body })
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const actorRole = session.user.role as Role
    const user = await pageService.updateUserRole(actorRole, params.id, parsed.data.role)
    return NextResponse.json(user)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message.includes('Permission denied') ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

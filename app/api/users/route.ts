import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import * as pageService from '@/services/pageService'
import type { Role } from '@/types'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = session.user.role as Role
    const users = await pageService.listUsers(userRole)
    return NextResponse.json(users)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message.includes('Permission denied') ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

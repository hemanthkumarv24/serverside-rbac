import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import * as pageService from '@/services/pageService'
import type { Role } from '@/types'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = session.user.role as Role
    const page = await pageService.publishPage(params.id, userRole)
    return NextResponse.json(page)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    let status = 500
    if (message.includes('Permission denied')) status = 403
    else if (message.includes('not found')) status = 404
    return NextResponse.json({ error: message }, { status })
  }
}

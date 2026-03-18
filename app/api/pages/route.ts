import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createPageSchema } from '@/lib/validators/page'
import * as pageService from '@/services/pageService'
import type { Role } from '@/types'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = session.user.role as Role
    const pages = await pageService.listPages(userRole)
    return NextResponse.json(pages)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = createPageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const userRole = session.user.role as Role
    const userId = session.user.id!

    const page = await pageService.createDraft(userId, userRole, parsed.data)
    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message.includes('Permission denied') ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

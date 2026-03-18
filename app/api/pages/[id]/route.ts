import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { updatePageSchema } from '@/lib/validators/page'
import * as pageService from '@/services/pageService'
import type { Role } from '@/types'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = session.user.role as Role
    const page = await pageService.getPage(params.id, userRole)

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    return NextResponse.json(page)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message.includes('Permission denied') ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = updatePageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const userRole = session.user.role as Role
    const page = await pageService.editDraft(params.id, userRole, parsed.data)
    return NextResponse.json(page)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    let status = 500
    if (message.includes('Permission denied')) status = 403
    else if (message.includes('not found')) status = 404
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = session.user.role as Role
    await pageService.deletePage(params.id, userRole)
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message.includes('Permission denied') ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

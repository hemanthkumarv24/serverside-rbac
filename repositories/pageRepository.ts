import { prisma } from '@/lib/db'
import type { CreatePageInput, UpdatePageInput } from '@/lib/validators/page'
import { randomBytes } from 'crypto'

export async function createPage(authorId: string, data: CreatePageInput) {
  return prisma.page.create({
    data: {
      title: data.title,
      content: data.content,
      authorId,
      status: 'DRAFT',
    },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  })
}

export async function findPageById(id: string) {
  return prisma.page.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  })
}

export async function findPageByPreviewToken(token: string) {
  return prisma.page.findUnique({
    where: { previewToken: token },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  })
}

export async function findAllPages(options?: { status?: string }) {
  return prisma.page.findMany({
    where: options?.status ? { status: options.status } : undefined,
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function updatePage(id: string, data: UpdatePageInput) {
  return prisma.page.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.content !== undefined && { content: data.content }),
    },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  })
}

export async function publishPage(id: string) {
  return prisma.page.update({
    where: { id },
    data: {
      status: 'PUBLISHED',
      publishedAt: new Date(),
      previewToken: null,
    },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  })
}

export async function setPreviewMode(id: string) {
  const token = randomBytes(32).toString('hex')
  return prisma.page.update({
    where: { id },
    data: {
      status: 'PREVIEW',
      previewToken: token,
    },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  })
}

export async function deletePage(id: string) {
  return prisma.page.delete({
    where: { id },
  })
}

export async function findAllUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function updateUserRole(userId: string, role: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const call = await prisma.call.findFirst({
      where: {
        id,
        lead: { userId: session.user.id }
      },
      include: {
        lead: true
      }
    })

    if (!call) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 })
    }

    return NextResponse.json({ call })
  } catch (error) {
    console.error('Error fetching call:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { notes, outcome, status, duration, transcript } = body

    const call = await prisma.call.findFirst({
      where: {
        id,
        lead: { userId: session.user.id }
      }
    })

    if (!call) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 })
    }

    const updatedCall = await prisma.call.update({
      where: { id },
      data: {
        notes,
        outcome,
        status,
        duration,
        transcript,
        completedAt: status === 'COMPLETED' && !call.completedAt ? new Date() : call.completedAt
      },
      include: {
        lead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ call: updatedCall, message: 'Call updated successfully' })
  } catch (error) {
    console.error('Error updating call:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const call = await prisma.call.findFirst({
      where: {
        id,
        lead: { userId: session.user.id }
      }
    })

    if (!call) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 })
    }

    await prisma.call.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Call deleted successfully' })
  } catch (error) {
    console.error('Error deleting call:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
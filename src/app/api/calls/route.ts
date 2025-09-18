import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('leadId')

    const where = leadId
      ? { lead: { userId: session.user.id }, leadId }
      : { lead: { userId: session.user.id } }

    const calls = await prisma.call.findMany({
      where,
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
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ calls })
  } catch (error) {
    console.error('Error fetching calls:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { leadId, notes, outcome, scheduledAt } = body

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 })
    }

    // Verify the lead belongs to the user
    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        userId: session.user.id
      }
    })

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const call = await prisma.call.create({
      data: {
        leadId,
        notes,
        outcome,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
        status: 'PENDING'
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

    return NextResponse.json({ call, message: 'Call scheduled successfully' })
  } catch (error) {
    console.error('Error creating call:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
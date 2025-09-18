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

    const campaigns = await prisma.campaign.findMany({
      where: { userId: session.user.id },
      include: {
        steps: true,
        _count: {
          select: {
            leadCampaigns: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ campaigns })
  } catch (error) {
    console.error('Error fetching campaigns:', error)
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
    const { name, description, steps } = body

    if (!name || !steps || steps.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        userId: session.user.id,
        isActive: true,
        steps: {
          create: steps.map((step: any, index: number) => ({
            stepNumber: index + 1,
            scriptTemplate: step.scriptTemplate,
            delayMinutes: step.delayMinutes || 0,
            isActive: step.isActive !== false
          }))
        }
      },
      include: {
        steps: true
      }
    })

    return NextResponse.json({ campaign, message: 'Campaign created successfully' })
  } catch (error) {
    console.error('Error creating campaign:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
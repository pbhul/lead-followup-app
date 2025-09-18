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

    const campaign = await prisma.campaign.findFirst({
      where: {
        id,
        userId: session.user.id
      },
      include: {
        steps: true,
        leadCampaigns: {
          include: {
            lead: true
          }
        }
      }
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    return NextResponse.json({ campaign })
  } catch (error) {
    console.error('Error fetching campaign:', error)
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
    const { name, description, isActive, steps } = body

    const campaign = await prisma.campaign.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Update campaign and steps
    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        name,
        description,
        isActive
      }
    })

    // If steps are provided, update them
    if (steps) {
      // Delete existing steps
      await prisma.campaignStep.deleteMany({
        where: { campaignId: id }
      })

      // Create new steps
      await prisma.campaignStep.createMany({
        data: steps.map((step: any, index: number) => ({
          campaignId: id,
          stepNumber: index + 1,
          scriptTemplate: step.scriptTemplate,
          delayMinutes: step.delayMinutes || 0,
          isActive: step.isActive !== false
        }))
      })
    }

    const finalCampaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        steps: true
      }
    })

    return NextResponse.json({ campaign: finalCampaign, message: 'Campaign updated successfully' })
  } catch (error) {
    console.error('Error updating campaign:', error)
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

    const campaign = await prisma.campaign.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    await prisma.campaign.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Campaign deleted successfully' })
  } catch (error) {
    console.error('Error deleting campaign:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
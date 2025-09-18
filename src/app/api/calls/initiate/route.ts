import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { blandAI } from '@/lib/bland-ai'
import { CallStatus } from '@/generated/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { leadId, campaignId } = body

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 })
    }

    // Get lead information
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { user: true }
    })

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Check if user owns this lead
    if (lead.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Generate script for the call
    const script = blandAI.generateScript({
      firstName: lead.firstName,
      lastName: lead.lastName,
      source: lead.source,
      budget: lead.budget || undefined,
      timeline: lead.timeline || undefined
    })

    // Create call record in database
    const call = await prisma.call.create({
      data: {
        leadId: lead.id,
        status: CallStatus.PENDING,
        scheduledAt: new Date(),
      }
    })

    // Initiate call with Bland AI
    const callResult = await blandAI.initiateCall({
      phone_number: lead.phone,
      task: script,
      voice: 'maya',
      reduce_latency: true,
      max_duration: 300,
      webhook: `${process.env.NEXTAUTH_URL}/api/webhooks/bland-ai`
    })

    if (callResult.status === 'error') {
      // Update call status to failed
      await prisma.call.update({
        where: { id: call.id },
        data: {
          status: CallStatus.FAILED,
          completedAt: new Date()
        }
      })

      return NextResponse.json({
        error: 'Failed to initiate call',
        details: callResult.message
      }, { status: 500 })
    }

    // Update call with Bland AI call ID
    await prisma.call.update({
      where: { id: call.id },
      data: {
        blandCallId: callResult.call_id,
        status: CallStatus.IN_PROGRESS
      }
    })

    return NextResponse.json({
      success: true,
      callId: call.id,
      blandCallId: callResult.call_id
    })

  } catch (error) {
    console.error('Error initiating call:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
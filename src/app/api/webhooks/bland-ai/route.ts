import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CallStatus, CallOutcome } from '@/generated/prisma'

interface BlandAIWebhookPayload {
  call_id: string
  status: 'completed' | 'failed' | 'in-progress'
  duration?: number
  recording_url?: string
  transcript?: string
  completed_at?: string
  analysis?: {
    sentiment?: string
    outcome?: string
    qualified?: boolean
    callback_requested?: boolean
    appointment_scheduled?: boolean
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload: BlandAIWebhookPayload = await request.json()

    console.log('Bland AI webhook received:', payload)

    // Find the call by Bland AI call ID
    const call = await prisma.call.findUnique({
      where: { blandCallId: payload.call_id },
      include: { lead: true }
    })

    if (!call) {
      console.error('Call not found for Bland AI call ID:', payload.call_id)
      return NextResponse.json({ error: 'Call not found' }, { status: 404 })
    }

    // Determine call outcome based on analysis
    let outcome: CallOutcome | undefined
    if (payload.analysis) {
      if (payload.analysis.qualified) {
        outcome = CallOutcome.QUALIFIED
      } else if (payload.analysis.callback_requested) {
        outcome = CallOutcome.CALLBACK_REQUESTED
      } else if (payload.analysis.appointment_scheduled) {
        outcome = CallOutcome.APPOINTMENT_SCHEDULED
      } else if (payload.transcript?.toLowerCase().includes('voicemail')) {
        outcome = CallOutcome.VOICEMAIL
      } else if (payload.duration && payload.duration < 30) {
        outcome = CallOutcome.NO_ANSWER
      } else {
        outcome = CallOutcome.NOT_QUALIFIED
      }
    }

    // Update call status
    await prisma.call.update({
      where: { id: call.id },
      data: {
        status: payload.status === 'completed' ? CallStatus.COMPLETED :
                payload.status === 'failed' ? CallStatus.FAILED :
                CallStatus.IN_PROGRESS,
        duration: payload.duration,
        recordingUrl: payload.recording_url,
        transcript: payload.transcript,
        outcome: outcome,
        completedAt: payload.completed_at ? new Date(payload.completed_at) :
                     payload.status === 'completed' ? new Date() : undefined
      }
    })

    // Update lead status based on call outcome
    if (outcome === CallOutcome.QUALIFIED) {
      await prisma.lead.update({
        where: { id: call.leadId },
        data: { status: 'QUALIFIED' }
      })
    } else if (outcome === CallOutcome.APPOINTMENT_SCHEDULED) {
      await prisma.lead.update({
        where: { id: call.leadId },
        data: { status: 'SCHEDULED' }
      })
    } else if (payload.status === 'completed' && call.lead.status === 'NEW') {
      await prisma.lead.update({
        where: { id: call.leadId },
        data: { status: 'CONTACTED' }
      })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error processing Bland AI webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Allow webhook to be called without authentication
export async function OPTIONS() {
  return new NextResponse(null, { status: 200 })
}
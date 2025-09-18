import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { campaignScheduler } from '@/lib/campaign-scheduler'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { leadId } = body
    const resolvedParams = await context.params
    const campaignId = resolvedParams.id

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 })
    }

    const leadCampaign = await campaignScheduler.addLeadToCampaign(leadId, campaignId)

    return NextResponse.json({
      success: true,
      leadCampaign,
      message: 'Lead added to campaign successfully'
    })

  } catch (error) {
    console.error('Error adding lead to campaign:', error)

    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    const statusCode = errorMessage.includes('already in this campaign') ? 400 :
                      errorMessage.includes('not found') ? 404 : 500

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { leadId } = body
    const resolvedParams = await context.params
    const campaignId = resolvedParams.id

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 })
    }

    await campaignScheduler.removeLeadFromCampaign(leadId, campaignId)

    return NextResponse.json({
      success: true,
      message: 'Lead removed from campaign successfully'
    })

  } catch (error) {
    console.error('Error removing lead from campaign:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
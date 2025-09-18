import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { campaignScheduler } from '@/lib/campaign-scheduler'

export async function POST(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin (optional security measure)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const processedCount = await campaignScheduler.processScheduledCampaigns()

    return NextResponse.json({
      success: true,
      processedCount,
      message: `Processed ${processedCount} scheduled campaigns`
    })

  } catch (error) {
    console.error('Error processing campaigns:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Allow GET for cron jobs/external schedulers
export async function GET() {
  try {
    const processedCount = await campaignScheduler.processScheduledCampaigns()

    return NextResponse.json({
      success: true,
      processedCount,
      message: `Processed ${processedCount} scheduled campaigns`
    })

  } catch (error) {
    console.error('Error processing campaigns:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
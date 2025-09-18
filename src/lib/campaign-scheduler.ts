import { prisma } from './prisma'
import { blandAI } from './bland-ai'
import { CallStatus, LeadStatus } from '@/generated/prisma'

export class CampaignScheduler {

  // Process scheduled campaigns and initiate calls
  async processScheduledCampaigns() {
    try {
      const now = new Date()

      // Find all active lead campaigns that are due for their next call
      const dueLeadCampaigns = await prisma.leadCampaign.findMany({
        where: {
          isActive: true,
          nextScheduledCall: {
            lte: now
          }
        },
        include: {
          lead: true,
          campaign: {
            include: {
              steps: {
                orderBy: { stepNumber: 'asc' }
              }
            }
          }
        }
      })

      for (const leadCampaign of dueLeadCampaigns) {
        await this.processLeadCampaign(leadCampaign)
      }

      console.log(`Processed ${dueLeadCampaigns.length} scheduled campaigns`)
      return dueLeadCampaigns.length

    } catch (error) {
      console.error('Error processing scheduled campaigns:', error)
      throw error
    }
  }

  private async processLeadCampaign(leadCampaign: any) {
    try {
      const { lead, campaign } = leadCampaign
      const currentStep = campaign.steps.find((step: any) =>
        step.stepNumber === leadCampaign.currentStep
      )

      if (!currentStep) {
        // No more steps, deactivate campaign
        await prisma.leadCampaign.update({
          where: { id: leadCampaign.id },
          data: { isActive: false }
        })
        return
      }

      // Check if lead is still eligible for calls
      if (lead.status === LeadStatus.CLOSED || lead.status === LeadStatus.LOST) {
        await prisma.leadCampaign.update({
          where: { id: leadCampaign.id },
          data: { isActive: false }
        })
        return
      }

      // Generate script for this step
      const script = this.generateStepScript(currentStep.script, lead)

      // Create call record
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

      if (callResult.status === 'success' && callResult.call_id) {
        // Update call with Bland AI call ID
        await prisma.call.update({
          where: { id: call.id },
          data: {
            blandCallId: callResult.call_id,
            status: CallStatus.IN_PROGRESS
          }
        })

        // Schedule next step
        await this.scheduleNextStep(leadCampaign, campaign.steps)

      } else {
        // Mark call as failed
        await prisma.call.update({
          where: { id: call.id },
          data: {
            status: CallStatus.FAILED,
            completedAt: new Date()
          }
        })
      }

    } catch (error) {
      console.error('Error processing lead campaign:', error)
    }
  }

  private async scheduleNextStep(leadCampaign: any, steps: any[]) {
    const nextStepNumber = leadCampaign.currentStep + 1
    const nextStep = steps.find(step => step.stepNumber === nextStepNumber)

    if (nextStep && nextStep.isActive) {
      const nextCallTime = new Date()
      nextCallTime.setMinutes(nextCallTime.getMinutes() + nextStep.delayMinutes)

      await prisma.leadCampaign.update({
        where: { id: leadCampaign.id },
        data: {
          currentStep: nextStepNumber,
          nextScheduledCall: nextCallTime
        }
      })
    } else {
      // No more steps, deactivate campaign
      await prisma.leadCampaign.update({
        where: { id: leadCampaign.id },
        data: {
          isActive: false,
          nextScheduledCall: null
        }
      })
    }
  }

  private generateStepScript(template: string, lead: any): string {
    let script = template

    // Replace placeholders with lead data
    script = script.replace(/{firstName}/g, lead.firstName)
    script = script.replace(/{lastName}/g, lead.lastName)
    script = script.replace(/{email}/g, lead.email)
    script = script.replace(/{phone}/g, lead.phone)
    script = script.replace(/{source}/g, lead.source)

    if (lead.budget) {
      script = script.replace(/{budget}/g, lead.budget.toLocaleString())
    }

    if (lead.timeline) {
      script = script.replace(/{timeline}/g, lead.timeline)
    }

    return script
  }

  // Add a lead to a campaign
  async addLeadToCampaign(leadId: string, campaignId: string) {
    try {
      // Check if lead is already in this campaign
      const existing = await prisma.leadCampaign.findUnique({
        where: {
          leadId_campaignId: {
            leadId,
            campaignId
          }
        }
      })

      if (existing) {
        throw new Error('Lead is already in this campaign')
      }

      // Get campaign steps to determine first call time
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: {
          steps: {
            orderBy: { stepNumber: 'asc' }
          }
        }
      })

      if (!campaign || !campaign.isActive) {
        throw new Error('Campaign not found or inactive')
      }

      const firstStep = campaign.steps[0]
      if (!firstStep) {
        throw new Error('Campaign has no steps')
      }

      // Schedule first call
      const firstCallTime = new Date()
      firstCallTime.setMinutes(firstCallTime.getMinutes() + firstStep.delayMinutes)

      const leadCampaign = await prisma.leadCampaign.create({
        data: {
          leadId,
          campaignId,
          currentStep: firstStep.stepNumber,
          nextScheduledCall: firstCallTime,
          isActive: true
        }
      })

      return leadCampaign

    } catch (error) {
      console.error('Error adding lead to campaign:', error)
      throw error
    }
  }

  // Remove a lead from a campaign
  async removeLeadFromCampaign(leadId: string, campaignId: string) {
    try {
      await prisma.leadCampaign.update({
        where: {
          leadId_campaignId: {
            leadId,
            campaignId
          }
        },
        data: {
          isActive: false,
          nextScheduledCall: null
        }
      })
    } catch (error) {
      console.error('Error removing lead from campaign:', error)
      throw error
    }
  }
}

export const campaignScheduler = new CampaignScheduler()
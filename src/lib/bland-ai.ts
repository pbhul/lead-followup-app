interface BlandAICallRequest {
  phone_number: string
  task: string
  voice?: 'maya' | 'ryan' | 'nat'
  reduce_latency?: boolean
  max_duration?: number
  webhook?: string
}

interface BlandAICallResponse {
  status: 'success' | 'error'
  call_id?: string
  message?: string
}

interface BlandAICallStatus {
  call_id: string
  status: 'queued' | 'ringing' | 'answered' | 'completed' | 'failed'
  duration?: number
  recording_url?: string
  transcript?: string
  completed_at?: string
}

export class BlandAIService {
  private apiKey: string
  private baseUrl = 'https://api.bland.ai'

  constructor() {
    this.apiKey = process.env.BLAND_API_KEY || ''
    if (!this.apiKey) {
      console.warn('BLAND_API_KEY not found in environment variables')
    }
  }

  async initiateCall(request: BlandAICallRequest): Promise<BlandAICallResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/calls`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: request.phone_number,
          task: request.task,
          voice: request.voice || 'maya',
          reduce_latency: request.reduce_latency || true,
          max_duration: request.max_duration || 300, // 5 minutes default
          webhook: request.webhook,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initiate call')
      }

      return {
        status: 'success',
        call_id: data.call_id,
      }
    } catch (error) {
      console.error('Bland AI call error:', error)
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async getCallStatus(callId: string): Promise<BlandAICallStatus | null> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/calls/${callId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to get call status')
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting call status:', error)
      return null
    }
  }

  async getCallRecording(callId: string): Promise<string | null> {
    try {
      const status = await this.getCallStatus(callId)
      return status?.recording_url || null
    } catch (error) {
      console.error('Error getting call recording:', error)
      return null
    }
  }

  // Generate a dynamic script based on lead information
  generateScript(leadData: {
    firstName: string
    lastName: string
    source: string
    budget?: number
    timeline?: string
  }): string {
    const baseScript = `Hi ${leadData.firstName}, this is an automated follow-up call regarding your interest in real estate services.`

    let script = baseScript

    if (leadData.source === 'OPEN_HOUSE') {
      script += ` Thank you for attending our open house. I wanted to follow up and see if you have any questions about the property you visited.`
    } else if (leadData.source === 'WEBSITE') {
      script += ` Thank you for your inquiry through our website. I'd love to help you find the perfect property.`
    } else {
      script += ` Thank you for your interest in working with us.`
    }

    if (leadData.budget) {
      script += ` I understand you're looking in the ${leadData.budget.toLocaleString()} dollar range.`
    }

    if (leadData.timeline) {
      script += ` And you mentioned your timeline is ${leadData.timeline}.`
    }

    script += ` I'd like to ask you a few quick questions to better understand your needs. First, are you currently working with any other real estate agents? Second, what's most important to you in your next home - location, size, or specific features? And finally, would you like to schedule a time to view some properties that match your criteria?`

    script += ` Based on your responses, I'll either connect you with one of our agents for a personalized consultation or schedule a property viewing. Thank you for your time!`

    return script
  }
}

export const blandAI = new BlandAIService()
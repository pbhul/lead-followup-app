export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  source: LeadSource
  status: LeadStatus
  notes?: string
  budget?: number
  timeline?: string
  createdAt: Date
  updatedAt: Date
  calls: Call[]
  campaigns: Campaign[]
}

export interface Call {
  id: string
  leadId: string
  status: CallStatus
  duration?: number
  recordingUrl?: string
  transcript?: string
  outcome?: CallOutcome
  scheduledAt: Date
  completedAt?: Date
  createdAt: Date
  lead: Lead
}

export interface Campaign {
  id: string
  name: string
  description?: string
  script: string
  isActive: boolean
  sequence: CampaignStep[]
  createdAt: Date
  updatedAt: Date
  leads: Lead[]
}

export interface CampaignStep {
  id: string
  campaignId: string
  stepNumber: number
  delayMinutes: number
  script: string
  isActive: boolean
}

export interface User {
  id: string
  email: string
  name?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  SCHEDULED = 'SCHEDULED',
  CLOSED = 'CLOSED',
  LOST = 'LOST'
}

export enum LeadSource {
  OPEN_HOUSE = 'OPEN_HOUSE',
  WEBSITE = 'WEBSITE',
  REFERRAL = 'REFERRAL',
  FACEBOOK = 'FACEBOOK',
  ZILLOW = 'ZILLOW',
  REALTOR_COM = 'REALTOR_COM',
  OTHER = 'OTHER'
}

export enum CallStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum CallOutcome {
  QUALIFIED = 'QUALIFIED',
  NOT_QUALIFIED = 'NOT_QUALIFIED',
  CALLBACK_REQUESTED = 'CALLBACK_REQUESTED',
  APPOINTMENT_SCHEDULED = 'APPOINTMENT_SCHEDULED',
  NO_ANSWER = 'NO_ANSWER',
  VOICEMAIL = 'VOICEMAIL',
  WRONG_NUMBER = 'WRONG_NUMBER'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT'
}
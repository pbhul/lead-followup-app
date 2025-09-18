import { PrismaClient, UserRole, LeadStatus, LeadSource } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      role: UserRole.AGENT,
    },
  })

  // Create some sample leads
  const leads = await Promise.all([
    prisma.lead.upsert({
      where: { id: 'lead-1' },
      update: {},
      create: {
        id: 'lead-1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        source: LeadSource.OPEN_HOUSE,
        status: LeadStatus.NEW,
        budget: 450000,
        timeline: '3-6 months',
        notes: 'Interested in single-family homes in downtown area',
        userId: user.id,
      },
    }),
    prisma.lead.upsert({
      where: { id: 'lead-2' },
      update: {},
      create: {
        id: 'lead-2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah@example.com',
        phone: '(555) 987-6543',
        source: LeadSource.WEBSITE,
        status: LeadStatus.CONTACTED,
        budget: 325000,
        timeline: '1-3 months',
        notes: 'First-time buyer, looking for condos',
        userId: user.id,
      },
    }),
    prisma.lead.upsert({
      where: { id: 'lead-3' },
      update: {},
      create: {
        id: 'lead-3',
        firstName: 'Mike',
        lastName: 'Davis',
        email: 'mike@example.com',
        phone: '(555) 555-0123',
        source: LeadSource.REFERRAL,
        status: LeadStatus.QUALIFIED,
        budget: 550000,
        timeline: 'ASAP',
        notes: 'Relocating for work, needs to move quickly',
        userId: user.id,
      },
    }),
  ])

  console.log({ user, leads })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Play, Pause, Users, Phone } from 'lucide-react'

export default function CampaignsPage() {
  // This will be replaced with real data from the database
  const campaigns = [
    {
      id: '1',
      name: 'New Lead Follow-up',
      description: 'Initial qualification call for new leads',
      isActive: true,
      leadsCount: 12,
      callsCount: 24,
      script: 'Hi {firstName}, thank you for your interest in our services...',
      createdAt: '2 days ago'
    },
    {
      id: '2',
      name: 'Second Follow-up',
      description: 'Follow-up for leads who didn\'t answer the first call',
      isActive: true,
      leadsCount: 8,
      callsCount: 16,
      script: 'Hi {firstName}, I tried reaching you earlier...',
      createdAt: '1 week ago'
    },
    {
      id: '3',
      name: 'Qualification Check',
      description: 'Check qualification status for contacted leads',
      isActive: false,
      leadsCount: 5,
      callsCount: 10,
      script: 'Hi {firstName}, I wanted to follow up on our previous conversation...',
      createdAt: '2 weeks ago'
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
            <p className="mt-2 text-gray-600">
              Manage your automated follow-up campaigns
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Campaign</span>
          </Button>
        </div>

        <div className="grid gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{campaign.name}</span>
                      {campaign.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>{campaign.description}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      {campaign.isActive ? (
                        <>
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium">Active Leads</span>
                      </div>
                      <span className="text-lg font-bold">{campaign.leadsCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium">Calls Made</span>
                      </div>
                      <span className="text-lg font-bold">{campaign.callsCount}</span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Script Preview</h4>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {campaign.script}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <p className="text-sm text-gray-500">Created {campaign.createdAt}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
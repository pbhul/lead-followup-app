import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CallButton } from '@/components/ui/call-button'
import { Plus, Phone, Mail, User } from 'lucide-react'

export default function LeadsPage() {
  // This will be replaced with real data from the database
  const leads = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      source: 'OPEN_HOUSE',
      status: 'NEW',
      budget: 450000,
      timeline: '3-6 months',
      createdAt: '2 hours ago'
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@example.com',
      phone: '(555) 987-6543',
      source: 'WEBSITE',
      status: 'CONTACTED',
      budget: 325000,
      timeline: '1-3 months',
      createdAt: '1 day ago'
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Davis',
      email: 'mike@example.com',
      phone: '(555) 555-0123',
      source: 'REFERRAL',
      status: 'QUALIFIED',
      budget: 550000,
      timeline: 'ASAP',
      createdAt: '3 days ago'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-green-100 text-green-800'
      case 'CONTACTED':
        return 'bg-yellow-100 text-yellow-800'
      case 'QUALIFIED':
        return 'bg-blue-100 text-blue-800'
      case 'SCHEDULED':
        return 'bg-purple-100 text-purple-800'
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
            <p className="mt-2 text-gray-600">
              Manage and follow up with your leads
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Lead</span>
          </Button>
        </div>

        <div className="grid gap-6">
          {leads.map((lead) => (
            <Card key={lead.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {lead.firstName} {lead.lastName}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{lead.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>{lead.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${lead.budget?.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">{lead.timeline}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">{lead.createdAt}</p>
                    </div>
                    <div className="flex space-x-2">
                      <CallButton
                        leadId={lead.id}
                        leadName={`${lead.firstName} ${lead.lastName}`}
                      />
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
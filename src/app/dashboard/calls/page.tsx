import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, Clock, CheckCircle, XCircle, User } from 'lucide-react'

export default function CallsPage() {
  // This will be replaced with real data from the database
  const calls = [
    {
      id: '1',
      leadName: 'John Smith',
      phone: '(555) 123-4567',
      status: 'COMPLETED',
      outcome: 'QUALIFIED',
      duration: 180,
      scheduledAt: '2:30 PM Today',
      completedAt: '2:35 PM Today',
      recordingUrl: '#'
    },
    {
      id: '2',
      leadName: 'Sarah Johnson',
      phone: '(555) 987-6543',
      status: 'COMPLETED',
      outcome: 'VOICEMAIL',
      duration: 45,
      scheduledAt: '1:00 PM Today',
      completedAt: '1:01 PM Today',
      recordingUrl: '#'
    },
    {
      id: '3',
      leadName: 'Mike Davis',
      phone: '(555) 555-0123',
      status: 'PENDING',
      outcome: null,
      duration: null,
      scheduledAt: '4:00 PM Today',
      completedAt: null,
      recordingUrl: null
    },
    {
      id: '4',
      leadName: 'Emily Brown',
      phone: '(555) 444-9999',
      status: 'FAILED',
      outcome: 'NO_ANSWER',
      duration: 30,
      scheduledAt: 'Yesterday 3:00 PM',
      completedAt: 'Yesterday 3:00 PM',
      recordingUrl: null
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getOutcomeColor = (outcome: string | null) => {
    if (!outcome) return 'bg-gray-100 text-gray-800'

    switch (outcome) {
      case 'QUALIFIED':
        return 'bg-green-100 text-green-800'
      case 'NOT_QUALIFIED':
        return 'bg-red-100 text-red-800'
      case 'CALLBACK_REQUESTED':
        return 'bg-blue-100 text-blue-800'
      case 'APPOINTMENT_SCHEDULED':
        return 'bg-purple-100 text-purple-800'
      case 'VOICEMAIL':
        return 'bg-yellow-100 text-yellow-800'
      case 'NO_ANSWER':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calls</h1>
          <p className="mt-2 text-gray-600">
            Monitor and review all voice agent calls
          </p>
        </div>

        <div className="grid gap-6">
          {calls.map((call) => (
            <Card key={call.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(call.status)}
                    </div>
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {call.leadName}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>{call.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Duration: {formatDuration(call.duration)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        Scheduled: {call.scheduledAt}
                      </p>
                      {call.completedAt && (
                        <p className="text-sm text-gray-500">
                          Completed: {call.completedAt}
                        </p>
                      )}
                    </div>
                    <div className="text-right space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                        {call.status}
                      </span>
                      {call.outcome && (
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOutcomeColor(call.outcome)}`}>
                            {call.outcome.replace('_', ' ')}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {call.recordingUrl && (
                        <Button variant="outline" size="sm">
                          Listen
                        </Button>
                      )}
                      {call.status === 'PENDING' && (
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}
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
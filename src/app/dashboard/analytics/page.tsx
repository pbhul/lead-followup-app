import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Phone, Users, Clock, Target } from 'lucide-react'

export default function AnalyticsPage() {
  // Mock data - in real app, this would come from database
  const analytics = {
    overview: {
      totalLeads: 156,
      totalCalls: 342,
      averageResponseTime: 2.4,
      conversionRate: 32.1
    },
    callOutcomes: [
      { outcome: 'Qualified', count: 45, percentage: 32.1 },
      { outcome: 'Not Qualified', count: 38, percentage: 27.1 },
      { outcome: 'Callback Requested', count: 28, percentage: 20.0 },
      { outcome: 'Voicemail', count: 18, percentage: 12.9 },
      { outcome: 'No Answer', count: 11, percentage: 7.9 }
    ],
    leadSources: [
      { source: 'Open House', count: 62, percentage: 39.7 },
      { source: 'Website', count: 48, percentage: 30.8 },
      { source: 'Referral', count: 28, percentage: 17.9 },
      { source: 'Facebook', count: 12, percentage: 7.7 },
      { source: 'Other', count: 6, percentage: 3.8 }
    ],
    campaignPerformance: [
      { name: 'New Lead Follow-up', leads: 45, calls: 89, conversion: 28.9 },
      { name: 'Second Follow-up', leads: 32, calls: 64, conversion: 21.9 },
      { name: 'Qualification Check', leads: 18, calls: 36, conversion: 38.9 }
    ]
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">
            Track performance and optimize your lead follow-up strategy
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalLeads}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalCalls}</div>
              <p className="text-xs text-muted-foreground">
                +24% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.averageResponseTime}m</div>
              <p className="text-xs text-muted-foreground">
                -15% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Call Outcomes */}
          <Card>
            <CardHeader>
              <CardTitle>Call Outcomes</CardTitle>
              <CardDescription>
                Distribution of call results over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.callOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: [
                            '#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#6b7280'
                          ][index]
                        }}
                      />
                      <span className="text-sm font-medium">{outcome.outcome}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{outcome.count}</div>
                      <div className="text-xs text-gray-500">{outcome.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lead Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Sources</CardTitle>
              <CardDescription>
                Where your leads are coming from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.leadSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: [
                            '#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#64748b'
                          ][index]
                        }}
                      />
                      <span className="text-sm font-medium">{source.source}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{source.count}</div>
                      <div className="text-xs text-gray-500">{source.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>
              How your different follow-up campaigns are performing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.campaignPerformance.map((campaign, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{campaign.name}</h4>
                    <p className="text-sm text-gray-500">
                      {campaign.leads} leads, {campaign.calls} calls
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {campaign.conversion}%
                    </div>
                    <p className="text-sm text-gray-500">conversion rate</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Key Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800">🎯 Best Performing Campaign</h4>
                <p className="text-sm text-green-700 mt-1">
                  &ldquo;Qualification Check&rdquo; has the highest conversion rate at 38.9%. Consider applying its script style to other campaigns.
                </p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800">📈 Response Time Improvement</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Your average response time has improved by 15% this month. Faster follow-ups correlate with higher conversion rates.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800">💡 Optimization Opportunity</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  27% of calls result in &ldquo;Not Qualified&rdquo; outcomes. Consider refining your lead qualification criteria before calling.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
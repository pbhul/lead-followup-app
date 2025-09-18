'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Download, FileText, Users, AlertCircle } from 'lucide-react'

export default function ImportPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{
    success: number
    errors: number
    total: number
  } | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Simulate file processing
    setTimeout(() => {
      setUploadResult({
        success: 8,
        errors: 2,
        total: 10
      })
      setIsUploading(false)
    }, 2000)
  }

  const downloadTemplate = () => {
    // Create CSV template
    const csvContent = "firstName,lastName,email,phone,source,budget,timeline,notes\nJohn,Smith,john@example.com,(555) 123-4567,OPEN_HOUSE,450000,3-6 months,Interested in downtown area\nSarah,Johnson,sarah@example.com,(555) 987-6543,WEBSITE,325000,1-3 months,First-time buyer"

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lead-import-template.csv'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const exportLeads = () => {
    // Simulate export - in real app, this would fetch from database
    const csvContent = "firstName,lastName,email,phone,source,status,budget,timeline,createdAt\nJohn,Smith,john@example.com,(555) 123-4567,OPEN_HOUSE,NEW,450000,3-6 months,2024-01-15\nSarah,Johnson,sarah@example.com,(555) 987-6543,WEBSITE,CONTACTED,325000,1-3 months,2024-01-14"

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Import & Export</h1>
          <p className="mt-2 text-gray-600">
            Import leads from CSV files or export your existing leads
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Import Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Import Leads</span>
              </CardTitle>
              <CardDescription>
                Upload a CSV file to import leads into your system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      {isUploading ? 'Processing...' : 'Drop CSV file here or click to upload'}
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept=".csv"
                      className="sr-only"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    CSV files up to 10MB
                  </p>
                </div>
              </div>

              {uploadResult && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="font-medium text-blue-900">Import Results</span>
                  </div>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>✅ {uploadResult.success} leads imported successfully</p>
                    {uploadResult.errors > 0 && (
                      <p>❌ {uploadResult.errors} leads failed to import</p>
                    )}
                    <p>📊 Total processed: {uploadResult.total}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={downloadTemplate}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Export Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Export Leads</span>
              </CardTitle>
              <CardDescription>
                Download your leads data as a CSV file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-900">
                    Ready to export your leads
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Includes all lead data and call history
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Button onClick={exportLeads} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Leads
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Filtered Leads
                </Button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium text-yellow-900">Note</span>
                </div>
                <p className="mt-1 text-sm text-yellow-700">
                  Exported files include sensitive information. Handle with care and follow your data protection policies.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Import Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Import Instructions</CardTitle>
            <CardDescription>
              Follow these guidelines for successful lead imports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Required Fields</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• firstName - Lead&apos;s first name</li>
                  <li>• lastName - Lead&apos;s last name</li>
                  <li>• email - Valid email address</li>
                  <li>• phone - Phone number with area code</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Optional Fields</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• source - OPEN_HOUSE, WEBSITE, REFERRAL, etc.</li>
                  <li>• budget - Budget in dollars (numeric)</li>
                  <li>• timeline - Expected timeframe</li>
                  <li>• notes - Additional information</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
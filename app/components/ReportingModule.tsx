'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useAppContext } from '@/app/context/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { format, subDays, isWithinInterval } from 'date-fns'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { Download, RefreshCw } from 'lucide-react'

export const ReportingModule: React.FC = () => {
  const { companies, communicationMethods, communications, fetchCommunications } = useAppContext()
  const [dateRange, setDateRange] = useState({ from: subDays(new Date(), 30), to: new Date() })
  const [selectedCompany, setSelectedCompany] = useState<string>('all')
  const [selectedMethod, setSelectedMethod] = useState<string>('all')
  const [activityLog, setActivityLog] = useState<any[]>([])

  useEffect(() => {
    fetchCommunications()
    const interval = setInterval(fetchCommunications, 60000) // Fetch every minute
    return () => clearInterval(interval)
  }, [fetchCommunications])

  useEffect(() => {
    setActivityLog(communications
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .map(comm => ({
        date: format(new Date(comm.date), 'MMM dd, yyyy HH:mm'),
        company: comm.companyId.name,
        method: comm.methodId.name
      })))
  }, [communications])

  // Communication Frequency Report
  const frequencyData = useMemo(() => {
    return communicationMethods.map(method => ({
      name: method.name,
      count: communications.filter(comm => 
        (selectedMethod === 'all' || comm.methodId._id === selectedMethod) &&
        (selectedCompany === 'all' || comm.companyId._id === selectedCompany) &&
        isWithinInterval(new Date(comm.date), { start: dateRange.from, end: dateRange.to })
      ).length
    }))
  }, [communications, communicationMethods, selectedCompany, selectedMethod, dateRange])

  // Engagement Effectiveness Dashboard
  const effectivenessData = useMemo(() => {
    // This is a placeholder. In a real application, you'd need to track responses and success rates.
    return communicationMethods.map(method => ({
      name: method.name,
      successRate: Math.random() * 100 // Random placeholder data
    }))
  }, [communicationMethods])

  // Overdue Communication Trends
  const overdueData = useMemo(() => {
    const days = 30
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), i)
      return {
        date: format(date, 'MMM dd'),
        overdue: companies.filter(company => {
          const lastComm = communications
            .filter(comm => comm.companyId._id === company._id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
          if (!lastComm) return true
          const nextDue = new Date(lastComm.date)
          nextDue.setDate(nextDue.getDate() + company.communicationPeriodicity)
          return nextDue < date
        }).length
      }
    }).reverse()
  }, [companies, communications])

  const exportToCSV = () => {
    const csvContent = [
      ['Report Type', 'Data'],
      ['Communication Frequency', ...frequencyData.map(d => `${d.name},${d.count}`)],
      ['Engagement Effectiveness', ...effectivenessData.map(d => `${d.name},${d.successRate.toFixed(2)}`)],
      ['Overdue Communication Trends', ...overdueData.map(d => `${d.date},${d.overdue}`)]
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'reports.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.text('Reports', 14, 15)

    // Communication Frequency
    doc.text('Communication Frequency', 14, 25)
    doc.autoTable({
      head: [['Method', 'Count']],
      body: frequencyData.map(d => [d.name, d.count]),
      startY: 30,
    })

    // Engagement Effectiveness
    doc.text('Engagement Effectiveness', 14, doc.lastAutoTable.finalY + 10)
    doc.autoTable({
      head: [['Method', 'Success Rate']],
      body: effectivenessData.map(d => [d.name, `${d.successRate.toFixed(2)}%`]),
      startY: doc.lastAutoTable.finalY + 15,
    })

    // Overdue Communication Trends
    doc.text('Overdue Communication Trends', 14, doc.lastAutoTable.finalY + 10)
    doc.autoTable({
      head: [['Date', 'Overdue']],
      body: overdueData.map(d => [d.date, d.overdue]),
      startY: doc.lastAutoTable.finalY + 15,
    })

    doc.save('reports.pdf')
  }

  return (
    <div className="space-y-8 p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Reports</h1>
      <Tabs defaultValue="frequency" className="space-y-4">
        <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger value="frequency" className="px-4 py-2">Communication Frequency</TabsTrigger>
          <TabsTrigger value="effectiveness" className="px-4 py-2">Engagement Effectiveness</TabsTrigger>
          <TabsTrigger value="overdue" className="px-4 py-2">Overdue Trends</TabsTrigger>
          <TabsTrigger value="activity" className="px-4 py-2">Activity Log</TabsTrigger>
        </TabsList>

        <div className="flex flex-wrap gap-4 mb-4">
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companies.map(company => (
                <SelectItem key={company._id} value={company._id}>{company.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMethod} onValueChange={setSelectedMethod}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              {communicationMethods.map(method => (
                <SelectItem key={method._id} value={method._id}>{method.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>

        <div className="flex gap-4 mb-8">
          <Button onClick={exportToPDF} className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 shadow-lg hover:shadow-xl">
            <Download className="mr-2 h-4 w-4" /> Export as PDF
          </Button>
          <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700 text-white transition-colors duration-200 shadow-lg hover:shadow-xl">
            <Download className="mr-2 h-4 w-4" /> Export as CSV
          </Button>
        </div>

        <TabsContent value="frequency">
          <Card>
            <CardHeader>
              <CardTitle>Communication Frequency Report</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={frequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="effectiveness">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Effectiveness Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={effectivenessData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="successRate" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Communication Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={overdueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="overdue" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Real-Time Activity Log</span>
                <Button onClick={fetchCommunications} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {activityLog.map((activity, index) => (
                  <li key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                    <span className="font-bold text-blue-600 dark:text-blue-400">{activity.date}</span> - 
                    <span className="font-semibold text-gray-700 dark:text-gray-300"> {activity.company}</span> - 
                    <span className="text-gray-600 dark:text-gray-400"> {activity.method}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

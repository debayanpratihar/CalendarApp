'use client'

import React, { useMemo } from 'react'
import { useAppContext } from '@/app/context/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'

export const ReportingModule: React.FC = () => {
  const { companies, communicationMethods, communications } = useAppContext()

  const communicationFrequency = useMemo(() => {
    const frequency = communicationMethods.map(method => ({
      name: method.name,
      count: communications.filter(comm => comm.methodId === method.id).length
    }))
    return frequency.sort((a, b) => b.count - a.count)
  }, [communicationMethods, communications])

  const monthlyTrend = useMemo(() => {
    const today = new Date()
    const firstDayOfMonth = startOfMonth(today)
    const lastDayOfMonth = endOfMonth(today)
    const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth })

    return daysInMonth.map(day => ({
      date: format(day, 'dd'),
      count: communications.filter(comm => format(comm.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).length
    }))
  }, [communications])

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Communication Frequency by Method</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={communicationFrequency}>
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

      <Card>
        <CardHeader>
          <CardTitle>Monthly Communication Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Communication Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Total Communications</h3>
              <p className="text-3xl font-bold">{communications.length}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Active Companies</h3>
              <p className="text-3xl font-bold">{companies.length}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Avg. Communications per Company</h3>
              <p className="text-3xl font-bold">
                {(communications.length / companies.length).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

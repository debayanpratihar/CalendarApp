'use client'

import React, { useState, useMemo } from 'react'
import { useAppContext } from '@/app/context/AppContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const UserModule: React.FC = () => {
  const { companies, communicationMethods, communications, addCommunication } = useAppContext()
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [newCommunication, setNewCommunication] = useState({
    companyId: '',
    methodId: '',
    date: new Date(),
    notes: '',
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'week' | 'month'>('week')

  const sortedCommunications = useMemo(() => {
    return [...communications].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [communications])

  const getLastFiveCommunications = (companyId: string) => {
    return sortedCommunications
      .filter(comm => comm.companyId === companyId)
      .slice(0, 5)
      .map(comm => {
        const method = communicationMethods.find(m => m._id === comm.methodId)
        return `${method?.name} (${format(new Date(comm.date), 'dd MMM')})`
      })
      .join(', ')
  }

  const getNextScheduledCommunication = (companyId: string) => {
    const company = companies.find(c => c._id === companyId)
    if (!company) return 'N/A'

    const lastCommunication = sortedCommunications.find(comm => comm.companyId === companyId)
    if (!lastCommunication) return 'Due Now'

    const nextDate = new Date(lastCommunication.date)
    nextDate.setDate(nextDate.getDate() + company.communicationPeriodicity)

    const nextMethod = communicationMethods.find(m => m.sequence > communicationMethods.find(cm => cm._id === lastCommunication?.methodId)?.sequence)?.id || communicationMethods[0]._id

    return `${communicationMethods.find(m => m._id === nextMethod)?.name} (${format(nextDate, 'dd MMM')})`
  }

  const getHighlightClass = (companyId: string) => {
    const company = companies.find(c => c._id === companyId)
    if (!company) return ''

    const lastCommunication = sortedCommunications.find(comm => comm.companyId === companyId)
    if (!lastCommunication) return 'bg-red-100'

    const nextDate = new Date(lastCommunication.date)
    nextDate.setDate(nextDate.getDate() + company.communicationPeriodicity)

    const today = new Date()
    if (nextDate < today) return 'bg-red-100'
    if (nextDate.toDateString() === today.toDateString()) return 'bg-yellow-100'
    return ''
  }

  const handleCommunicationPerformed = async () => {
    const newComms = selectedCompanies.map(companyId => ({
      companyId,
      methodId: newCommunication.methodId,
      date: newCommunication.date,
      notes: newCommunication.notes,
    }))

    for (const comm of newComms) {
      await addCommunication(comm)
    }

    setSelectedCompanies([])
    setNewCommunication({
      companyId: '',
      methodId: '',
      date: new Date(),
      notes: '',
    })
    setIsDialogOpen(false)
  }

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate),
  })

  const getDayEvents = (day: Date) => {
    return communications.filter(comm => isSameDay(new Date(comm.date), day))
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Company Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Select</TableHead>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Last Five Communications</TableHead>
                    <TableHead>Next Scheduled Communication</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company._id} className={getHighlightClass(company._id)}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedCompanies.includes(company._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCompanies([...selectedCompanies, company._id])
                            } else {
                              setSelectedCompanies(selectedCompanies.filter(id => id !== company._id))
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>{company.name}</TableCell>
                      <TableCell>{getLastFiveCommunications(company._id)}</TableCell>
                      <TableCell>{getNextScheduledCommunication(company._id)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4" disabled={selectedCompanies.length === 0}>Communication Performed</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Communication</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select
                  value={newCommunication.methodId}
                  onValueChange={(value) => setNewCommunication({ ...newCommunication, methodId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select communication method" />
                  </SelectTrigger>
                  <SelectContent>
                    {communicationMethods.map((method) => (
                      <SelectItem key={method._id} value={method._id}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newCommunication.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newCommunication.date ? format(newCommunication.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newCommunication.date}
                      onSelect={(date) => date && setNewCommunication({ ...newCommunication, date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Textarea
                  placeholder="Add notes..."
                  value={newCommunication.notes}
                  onChange={(e) => setNewCommunication({ ...newCommunication, notes: e.target.value })}
                />
                <Button onClick={handleCommunicationPerformed}>Submit</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Overdue Communications</h3>
                  <ul className="mt-2 space-y-2">
                    {companies.filter(company => getHighlightClass(company._id) === 'bg-red-100').map(company => (
                      <li key={company._id} className="flex items-center">
                        <Badge variant="destructive" className="mr-2">Overdue</Badge>
                        {company.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Today's Communications</h3>
                  <ul className="mt-2 space-y-2">
                    {companies.filter(company => getHighlightClass(company._id) === 'bg-yellow-100').map(company => (
                      <li key={company._id} className="flex items-center">
                        <Badge variant="warning" className="mr-2">Today</Badge>
                        {company.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Communication Calendar</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setView('week')}>Week</Button>
                  <Button variant="outline" size="sm" onClick={() => setView('month')}>Month</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {view === 'week' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(addDays(currentDate, -7))}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-semibold">
                      {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(addDays(currentDate, 7))}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day) => (
                      <div key={day.toString()} className="border rounded p-2">
                        <div className="font-semibold mb-2">{format(day, 'EEE d')}</div>
                        {getDayEvents(day).map((event) => (
                          <div key={event._id} className="text-sm bg-blue-100 rounded p-1 mb-1">
                            {companies.find(c => c._id === event.companyId)?.name}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {view === 'month' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(addDays(currentDate, -30))}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-semibold">{format(currentDate, 'MMMM yyyy')}</span>
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(addDays(currentDate, 30))}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <Calendar
                    mode="single"
                    selected={currentDate}
                    onSelect={(date) => date && setCurrentDate(date)}
                    className="rounded-md border"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

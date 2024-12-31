'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useAppContext } from '@/app/context/AppContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, isPast, addMonths, startOfMonth, endOfMonth, isSameMonth } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export const UserModule: React.FC = () => {
  const { companies, communicationMethods, communications, addCommunication, updateCompany } = useAppContext()
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
  const [highlightDisabled, setHighlightDisabled] = useState<{ [key: string]: boolean }>({})

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
    if (highlightDisabled[companyId]) return ''

    const company = companies.find(c => c._id === companyId)
    if (!company) return ''

    const lastCommunication = sortedCommunications.find(comm => comm.companyId === companyId)
    if (!lastCommunication) return 'bg-red-100 dark:bg-red-900'

    const nextDate = new Date(lastCommunication.date)
    nextDate.setDate(nextDate.getDate() + company.communicationPeriodicity)

    const today = new Date()
    if (nextDate < today) return 'bg-red-100 dark:bg-red-900'
    if (nextDate.toDateString() === today.toDateString()) return 'bg-yellow-100 dark:bg-yellow-900'
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

  const toggleHighlight = async (companyId: string) => {
    const newHighlightDisabled = { ...highlightDisabled, [companyId]: !highlightDisabled[companyId] }
    setHighlightDisabled(newHighlightDisabled)
    
    const company = companies.find(c => c._id === companyId)
    if (company) {
      await updateCompany(companyId, { ...company, highlightDisabled: newHighlightDisabled[companyId] })
    }
  }

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate),
  })

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  })

  const getDayEvents = (day: Date) => {
    return communications.filter(comm => isSameDay(new Date(comm.date), day))
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Company Name', 'Last Five Communications', 'Next Scheduled Communication'],
      ...companies.map(company => [
        company.name,
        getLastFiveCommunications(company._id),
        getNextScheduledCommunication(company._id)
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'company_communications.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.text('Company Communications', 14, 15)
    doc.autoTable({
      head: [['Company Name', 'Last Five Communications', 'Next Scheduled Communication']],
      body: companies.map(company => [
        company.name,
        getLastFiveCommunications(company._id),
        getNextScheduledCommunication(company._id)
      ]),
      startY: 20,
    })
    doc.save('company_communications.pdf')
  }

  useEffect(() => {
    // Load highlight disabled state from companies
    const newHighlightDisabled: { [key: string]: boolean } = {}
    companies.forEach(company => {
      newHighlightDisabled[company._id] = company.highlightDisabled || false
    })
    setHighlightDisabled(newHighlightDisabled)
  }, [companies])

  return (
    <div className="space-y-8">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <Card className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Company Dashboard</CardTitle>
              <div className="flex space-x-2">
                <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700">
                  <Download className="mr-2 h-4 w-4" /> CSV
                </Button>
                <Button onClick={exportToPDF} className="bg-red-600 hover:bg-red-700">
                  <Download className="mr-2 h-4 w-4" /> PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Select</TableHead>
                      <TableHead>Company Name</TableHead>
                      <TableHead className="hidden md:table-cell">Last Five Communications</TableHead>
                      <TableHead>Next Scheduled</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
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
                            className="form-checkbox h-5 w-5 text-primary"
                          />
                        </TableCell>
                        <TableCell>{company.name}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">{getLastFiveCommunications(company._id)}</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                {sortedCommunications
                                  .filter(comm => comm.companyId === company._id)
                                  .slice(0, 5)
                                  .map(comm => (
                                    <div key={comm._id}>
                                      {`${communicationMethods.find(m => m._id === comm.methodId)?.name} (${format(new Date(comm.date), 'dd MMM')}): ${comm.notes}`}
                                    </div>
                                  ))}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>{getNextScheduledCommunication(company._id)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => toggleHighlight(company._id)}>
                            {highlightDisabled[company._id] ? 'Enable' : 'Disable'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mb-4" disabled={selectedCompanies.length === 0}>Communication Performed</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Log Communication</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
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

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Overdue Communications</h3>
                  <ul className="mt-2 space-y-2">
                    {companies.filter(company => getHighlightClass(company._id) === 'bg-red-100 dark:bg-red-900').map(company => (
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
                    {companies.filter(company => getHighlightClass(company._id) === 'bg-yellow-100 dark:bg-yellow-900').map(company => (
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
                        <div className={cn("font-semibold mb-2", isToday(day) && "text-blue-600")}>{format(day, 'EEE d')}</div>
                        {getDayEvents(day).map((event) => (
                          <TooltipProvider key={event._id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="text-sm bg-blue-100 dark:bg-blue-800 rounded p-1 mb-1 cursor-pointer">
                                  {companies.find(c => c._id === event.companyId)?.name}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{communicationMethods.find(m => m._id === event.methodId)?.name}</p>
                                <p>{event.notes}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {view === 'month' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, -1))}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-semibold">{format(currentDate, 'MMMM yyyy')}</span>
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {monthDays.map((day) => (
                      <div key={day.toString()} className={cn("border rounded p-2", !isSameMonth(day, currentDate) && "opacity-50")}>
                        <div className={cn("font-semibold mb-2", isToday(day) && "text-blue-600")}>{format(day, 'd')}</div>
                        {getDayEvents(day).map((event) => (
                          <TooltipProvider key={event._id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="text-sm bg-blue-100 dark:bg-blue-800 rounded p-1 mb-1 cursor-pointer">
                                  {companies.find(c => c._id === event.companyId)?.name}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{communicationMethods.find(m => m._id === event.methodId)?.name}</p>
                                <p>{event.notes}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


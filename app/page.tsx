'use client'

import { useState } from 'react'
import { ThemeProvider } from 'next-themes'
import { AdminModule } from '@/app/components/AdminModule'
import { UserModule } from '@/app/components/UserModule'
import { ReportingModule } from '@/app/components/ReportingModule'
import { AppProvider } from '@/app/context/AppContext'
import { Layout } from '@/app/components/Layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function CalendarContent() {
  const [activeModule, setActiveModule] = useState('user')

  return (
    <Tabs value={activeModule} onValueChange={setActiveModule} className="space-y-4">
      <TabsList>
        <TabsTrigger value="user">User Dashboard</TabsTrigger>
        <TabsTrigger value="admin">Admin</TabsTrigger>
        <TabsTrigger value="reporting">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="user">
        <UserModule />
      </TabsContent>
      <TabsContent value="admin">
        <AdminModule />
      </TabsContent>
      <TabsContent value="reporting">
        <ReportingModule />
      </TabsContent>
    </Tabs>
  )
}

export default function Calendar() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppProvider>
        <Layout>
          <CalendarContent />
        </Layout>
      </AppProvider>
    </ThemeProvider>
  )
}

'use client'

import { useState } from 'react'
import { AdminModule } from '@/app/components/AdminModule'
import { UserModule } from '@/app/components/UserModule'
import { ReportingModule } from '@/app/components/ReportingModule'
import { AppProvider } from '@/app/context/AppContext'
import { Sidebar } from '@/app/components/Sidebar'
import { Header } from '@/app/components/Header'

function CalendarContent() {
  const [activeModule, setActiveModule] = useState('user')

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          {activeModule === 'user' && <UserModule />}
          {activeModule === 'admin' && <AdminModule />}
          {activeModule === 'reporting' && <ReportingModule />}
        </main>
      </div>
    </div>
  )
}

export default function Calendar() {
  return (
    <AppProvider>
      <CalendarContent />
    </AppProvider>
  )
}

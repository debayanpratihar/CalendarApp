'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Company {
  _id: string
  name: string
  location: string
  linkedInProfile: string
  emails: string[]
  phoneNumbers: string[]
  comments: string
  communicationPeriodicity: number
}

export interface CommunicationMethod {
  _id: string
  name: string
  description: string
  sequence: number
  mandatory: boolean
}

export interface Communication {
  _id: string
  companyId: string
  methodId: string
  date: Date
  notes: string
}

interface AppContextType {
  companies: Company[]
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>
  communicationMethods: CommunicationMethod[]
  setCommunicationMethods: React.Dispatch<React.SetStateAction<CommunicationMethod[]>>
  communications: Communication[]
  setCommunications: React.Dispatch<React.SetStateAction<Communication[]>>
  fetchCompanies: () => Promise<void>
  fetchCommunicationMethods: () => Promise<void>
  fetchCommunications: () => Promise<void>
  addCompany: (company: Omit<Company, '_id'>) => Promise<void>
  updateCompany: (id: string, company: Partial<Company>) => Promise<void>
  deleteCompany: (id: string) => Promise<void>
  addCommunicationMethod: (method: Omit<CommunicationMethod, '_id'>) => Promise<void>
  updateCommunicationMethod: (id: string, method: Partial<CommunicationMethod>) => Promise<void>
  deleteCommunicationMethod: (id: string) => Promise<void>
  addCommunication: (communication: Omit<Communication, '_id'>) => Promise<void>
  updateCommunication: (id: string, communication: Partial<Communication>) => Promise<void>
  deleteCommunication: (id: string) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [communicationMethods, setCommunicationMethods] = useState<CommunicationMethod[]>([])
  const [communications, setCommunications] = useState<Communication[]>([])

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies')
      if (!response.ok) throw new Error('Failed to fetch companies')
      const data = await response.json()
      setCompanies(data)
    } catch (error) {
      console.error('Error fetching companies:', error)
    }
  }

  const fetchCommunicationMethods = async () => {
    try {
      const response = await fetch('/api/communication-methods')
      if (!response.ok) throw new Error('Failed to fetch communication methods')
      const data = await response.json()
      setCommunicationMethods(data)
    } catch (error) {
      console.error('Error fetching communication methods:', error)
    }
  }

  const fetchCommunications = async () => {
    try {
      const response = await fetch('/api/communications')
      if (!response.ok) throw new Error('Failed to fetch communications')
      const data = await response.json()
      setCommunications(data)
    } catch (error) {
      console.error('Error fetching communications:', error)
    }
  }

  const addCompany = async (company: Omit<Company, '_id'>) => {
    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(company),
      })
      if (!response.ok) throw new Error('Failed to add company')
      const newCompany = await response.json()
      setCompanies([...companies, newCompany])
    } catch (error) {
      console.error('Error adding company:', error)
    }
  }

  const updateCompany = async (id: string, company: Partial<Company>) => {
    try {
      const response = await fetch(`/api/companies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(company),
      })
      if (!response.ok) throw new Error('Failed to update company')
      const updatedCompany = await response.json()
      setCompanies(companies.map(c => c._id === id ? updatedCompany : c))
    } catch (error) {
      console.error('Error updating company:', error)
    }
  }

  const deleteCompany = async (id: string) => {
    try {
      const response = await fetch(`/api/companies/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete company')
      setCompanies(companies.filter(c => c._id !== id))
    } catch (error) {
      console.error('Error deleting company:', error)
    }
  }

  const addCommunicationMethod = async (method: Omit<CommunicationMethod, '_id'>) => {
    try {
      const response = await fetch('/api/communication-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(method),
      })
      if (!response.ok) throw new Error('Failed to add communication method')
      const newMethod = await response.json()
      setCommunicationMethods([...communicationMethods, newMethod])
    } catch (error) {
      console.error('Error adding communication method:', error)
    }
  }

  const updateCommunicationMethod = async (id: string, method: Partial<CommunicationMethod>) => {
    try {
      const response = await fetch(`/api/communication-methods/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(method),
      })
      if (!response.ok) throw new Error('Failed to update communication method')
      const updatedMethod = await response.json()
      setCommunicationMethods(communicationMethods.map(m => m._id === id ? updatedMethod : m))
    } catch (error) {
      console.error('Error updating communication method:', error)
    }
  }

  const deleteCommunicationMethod = async (id: string) => {
    try {
      const response = await fetch(`/api/communication-methods/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete communication method')
      setCommunicationMethods(communicationMethods.filter(m => m._id !== id))
    } catch (error) {
      console.error('Error deleting communication method:', error)
    }
  }

  const addCommunication = async (communication: Omit<Communication, '_id'>) => {
    try {
      const response = await fetch('/api/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(communication),
      })
      if (!response.ok) throw new Error('Failed to add communication')
      const newCommunication = await response.json()
      setCommunications([...communications, newCommunication])
    } catch (error) {
      console.error('Error adding communication:', error)
    }
  }

  const updateCommunication = async (id: string, communication: Partial<Communication>) => {
    try {
      const response = await fetch(`/api/communications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(communication),
      })
      if (!response.ok) throw new Error('Failed to update communication')
      const updatedCommunication = await response.json()
      setCommunications(communications.map(c => c._id === id ? updatedCommunication : c))
    } catch (error) {
      console.error('Error updating communication:', error)
    }
  }

  const deleteCommunication = async (id: string) => {
    try {
      const response = await fetch(`/api/communications/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete communication')
      setCommunications(communications.filter(c => c._id !== id))
    } catch (error) {
      console.error('Error deleting communication:', error)
    }
  }

  useEffect(() => {
    fetchCompanies()
    fetchCommunicationMethods()
    fetchCommunications()
  }, [])

  return (
    <AppContext.Provider value={{
      companies,
      setCompanies,
      communicationMethods,
      setCommunicationMethods,
      communications,
      setCommunications,
      fetchCompanies,
      fetchCommunicationMethods,
      fetchCommunications,
      addCompany,
      updateCompany,
      deleteCompany,
      addCommunicationMethod,
      updateCommunicationMethod,
      deleteCommunicationMethod,
      addCommunication,
      updateCommunication,
      deleteCommunication,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

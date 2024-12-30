'use client'

import React, { useState } from 'react'
import { useAppContext } from '@/app/context/AppContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Edit } from 'lucide-react'

export const AdminModule: React.FC = () => {
  const { 
    companies, 
    communicationMethods, 
    addCompany, 
    updateCompany, 
    deleteCompany, 
    addCommunicationMethod, 
    updateCommunicationMethod, 
    deleteCommunicationMethod 
  } = useAppContext()

  const [newCompany, setNewCompany] = useState({
    name: '',
    location: '',
    linkedInProfile: '',
    emails: '',
    phoneNumbers: '',
    comments: '',
    communicationPeriodicity: 14,
  })
  const [newMethod, setNewMethod] = useState({
    name: '',
    description: '',
    sequence: 0,
    mandatory: false,
  })
  const [editingCompany, setEditingCompany] = useState<string | null>(null)
  const [editingMethod, setEditingMethod] = useState<string | null>(null)

  const handleAddCompany = async () => {
    await addCompany({
      ...newCompany,
      emails: newCompany.emails.split(','),
      phoneNumbers: newCompany.phoneNumbers.split(','),
    })
    setNewCompany({
      name: '',
      location: '',
      linkedInProfile: '',
      emails: '',
      phoneNumbers: '',
      comments: '',
      communicationPeriodicity: 14,
    })
  }

  const handleAddMethod = async () => {
    await addCommunicationMethod(newMethod)
    setNewMethod({
      name: '',
      description: '',
      sequence: 0,
      mandatory: false,
    })
  }

  const handleEditCompany = (id: string) => {
    const company = companies.find(c => c._id === id)
    if (company) {
      setNewCompany({
        ...company,
        emails: company.emails.join(','),
        phoneNumbers: company.phoneNumbers.join(','),
      })
      setEditingCompany(id)
    }
  }

  const handleUpdateCompany = async () => {
    if (editingCompany) {
      await updateCompany(editingCompany, {
        ...newCompany,
        emails: newCompany.emails.split(','),
        phoneNumbers: newCompany.phoneNumbers.split(','),
      })
      setEditingCompany(null)
      setNewCompany({
        name: '',
        location: '',
        linkedInProfile: '',
        emails: '',
        phoneNumbers: '',
        comments: '',
        communicationPeriodicity: 14,
      })
    }
  }

  const handleDeleteCompany = async (id: string) => {
    await deleteCompany(id)
  }

  const handleEditMethod = (id: string) => {
    const method = communicationMethods.find(m => m._id === id)
    if (method) {
      setNewMethod(method)
      setEditingMethod(id)
    }
  }

  const handleUpdateMethod = async () => {
    if (editingMethod) {
      await updateCommunicationMethod(editingMethod, newMethod)
      setEditingMethod(null)
      setNewMethod({
        name: '',
        description: '',
        sequence: 0,
        mandatory: false,
      })
    }
  }

  const handleDeleteMethod = async (id: string) => {
    await deleteCommunicationMethod(id)
  }

  return (
    <Tabs defaultValue="companies" className="w-full">
      <TabsList>
        <TabsTrigger value="companies">Companies</TabsTrigger>
        <TabsTrigger value="methods">Communication Methods</TabsTrigger>
      </TabsList>
      <TabsContent value="companies">
        <Card>
          <CardHeader>
            <CardTitle>{editingCompany ? 'Edit Company' : 'Add New Company'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newCompany.location}
                  onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="linkedInProfile">LinkedIn Profile</Label>
                <Input
                  id="linkedInProfile"
                  value={newCompany.linkedInProfile}
                  onChange={(e) => setNewCompany({ ...newCompany, linkedInProfile: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="emails">Emails (comma-separated)</Label>
                <Input
                  id="emails"
                  value={newCompany.emails}
                  onChange={(e) => setNewCompany({ ...newCompany, emails: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phoneNumbers">Phone Numbers (comma-separated)</Label>
                <Input
                  id="phoneNumbers"
                  value={newCompany.phoneNumbers}
                  onChange={(e) => setNewCompany({ ...newCompany, phoneNumbers: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="comments">Comments</Label>
                <Textarea
                  id="comments"
                  value={newCompany.comments}
                  onChange={(e) => setNewCompany({ ...newCompany, comments: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="communicationPeriodicity">Communication Periodicity (days)</Label>
                <Input
                  id="communicationPeriodicity"
                  type="number"
                  value={newCompany.communicationPeriodicity}
                  onChange={(e) => setNewCompany({ ...newCompany, communicationPeriodicity: parseInt(e.target.value) })}
                />
              </div>
              <Button onClick={editingCompany ? handleUpdateCompany : handleAddCompany}>
                {editingCompany ? 'Update Company' : 'Add Company'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>LinkedIn Profile</TableHead>
                  <TableHead>Emails</TableHead>
                  <TableHead>Phone Numbers</TableHead>
                  <TableHead>Communication Periodicity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company._id}>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>{company.location}</TableCell>
                    <TableCell>{company.linkedInProfile}</TableCell>
                    <TableCell>{company.emails.join(', ')}</TableCell>
                    <TableCell>{company.phoneNumbers.join(', ')}</TableCell>
                    <TableCell>{company.communicationPeriodicity} days</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleEditCompany(company._id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteCompany(company._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="methods">
        <Card>
          <CardHeader>
            <CardTitle>{editingMethod ? 'Edit Communication Method' : 'Add New Communication Method'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="methodName">Method Name</Label>
                <Input
                  id="methodName"
                  value={newMethod.name}
                  onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newMethod.description}
                  onChange={(e) => setNewMethod({ ...newMethod, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="sequence">Sequence</Label>
                <Input
                  id="sequence"
                  type="number"
                  value={newMethod.sequence}
                  onChange={(e) => setNewMethod({ ...newMethod, sequence: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="mandatory"
                  type="checkbox"
                  checked={newMethod.mandatory}
                  onChange={(e) => setNewMethod({ ...newMethod, mandatory: e.target.checked })}
                />
                <Label htmlFor="mandatory">Mandatory</Label>
              </div>
              <Button onClick={editingMethod ? handleUpdateMethod : handleAddMethod}>
                {editingMethod ? 'Update Method' : 'Add Method'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Communication Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Sequence</TableHead>
                  <TableHead>Mandatory</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {communicationMethods.map((method) => (
                  <TableRow key={method._id}>
                    <TableCell>{method.name}</TableCell>
                    <TableCell>{method.description}</TableCell>
                    <TableCell>{method.sequence}</TableCell>
                    <TableCell>{method.mandatory ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleEditMethod(method._id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteMethod(method._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

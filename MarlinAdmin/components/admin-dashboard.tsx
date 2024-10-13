'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Mail, AlertTriangle, CheckCircle, XCircle, Search, Plus } from 'lucide-react'

export function AdminDashboardComponent() {
  const [searchTerm, setSearchTerm] = useState('')

  const templateEmails = [
    { id: 1, name: 'Welcome Email', subject: 'Welcome to our platform!', status: 'Approved' },
    { id: 2, name: 'Password Reset', subject: 'Reset your password', status: 'Pending' },
    { id: 3, name: 'Account Verification', subject: 'Verify your account', status: 'Rejected' },
  ]

  const reportedEmails = [
    { id: 1, subject: 'Suspicious offer', reportedBy: 'user@example.com', status: 'Pending' },
    { id: 2, subject: 'Potential phishing attempt', reportedBy: 'admin@example.com', status: 'Reviewed' },
    { id: 3, subject: 'Spam content', reportedBy: 'support@example.com', status: 'Pending' },
  ]

  const reviewRequests = [
    { id: 1, emailName: 'New Product Announcement', requestedBy: 'marketing@example.com', status: 'Pending' },
    { id: 2, emailName: 'Customer Feedback Survey', requestedBy: 'research@example.com', status: 'In Progress' },
    { id: 3, emailName: 'Holiday Promotion', requestedBy: 'sales@example.com', status: 'Completed' },
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Email Admin Dashboard</h1>
      <Tabs defaultValue="templates">
        <TabsList className="mb-4">
          <TabsTrigger value="templates">Template Emails</TabsTrigger>
          <TabsTrigger value="reports">Reported Emails</TabsTrigger>
          <TabsTrigger value="reviews">Review Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Template Emails</CardTitle>
              <CardDescription>Manage and review email templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add New Template
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templateEmails.map((email) => (
                    <TableRow key={email.id}>
                      <TableCell>{email.name}</TableCell>
                      <TableCell>{email.subject}</TableCell>
                      <TableCell>
                        <Badge variant={email.status === 'Approved' ? 'success' : email.status === 'Pending' ? 'warning' : 'destructive'}>
                          {email.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Preview</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reported Emails</CardTitle>
              <CardDescription>Review and manage reported emails</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportedEmails.map((email) => (
                    <TableRow key={email.id}>
                      <TableCell>{email.subject}</TableCell>
                      <TableCell>{email.reportedBy}</TableCell>
                      <TableCell>
                        <Badge variant={email.status === 'Reviewed' ? 'success' : 'warning'}>
                          {email.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Review</Button>
                        <Button variant="ghost" size="sm">Dismiss</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Review Requests</CardTitle>
              <CardDescription>Manage requests for email template reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email Name</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.emailName}</TableCell>
                      <TableCell>{request.requestedBy}</TableCell>
                      <TableCell>
                        <Badge variant={request.status === 'Completed' ? 'success' : request.status === 'In Progress' ? 'warning' : 'default'}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Review</Button>
                        <Button variant="ghost" size="sm">Approve</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
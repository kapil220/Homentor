
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Users, User, BookOpen, LineChart, CheckCircle, Clock, Calendar, MessageSquare, Search, Settings, Shield } from 'lucide-react';

// Mock data for the admin dashboard
const platformStats = {
  totalUsers: 28675,
  activeUsers: 15430,
  totalMentors: 532,
  totalStudents: 28143,
  verifiedMentors: 489,
  pendingVerification: 43,
  totalSessions: 12548,
  activeSubjects: 42,
  totalEarnings: 524890,
  growthRate: 18.5,
};

const recentMentors = [
  {
    id: 1,
    name: 'David Wilson',
    subjects: ['Computer Science', 'Mathematics'],
    rating: 4.7,
    joinedDate: '2025-05-15',
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100&h=100&fit=crop',
  },
  {
    id: 2,
    name: 'Jennifer Lee',
    subjects: ['History', 'Social Studies'],
    rating: 4.9,
    joinedDate: '2025-05-13',
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=100&h=100&fit=crop',
  },
  {
    id: 3,
    name: 'Robert Thomas',
    subjects: ['Spanish', 'French'],
    rating: 4.8,
    joinedDate: '2025-05-10',
    isVerified: false,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop',
  },
];

const pendingVerifications = [
  {
    id: 1,
    name: 'Robert Thomas',
    subjects: ['Spanish', 'French'],
    submittedDate: '2025-05-10',
    documentType: 'Teaching Certificate',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop',
  },
  {
    id: 2,
    name: 'Amanda Wilson',
    subjects: ['Biology', 'Chemistry'],
    submittedDate: '2025-05-12',
    documentType: 'Academic Credentials',
    image: 'https://randomuser.me/api/portraits/women/53.jpg',
  },
  {
    id: 3,
    name: 'James Rodriguez',
    subjects: ['Music Theory', 'Piano'],
    submittedDate: '2025-05-14',
    documentType: 'Professional Certificate',
    image: 'https://randomuser.me/api/portraits/men/66.jpg',
  },
];

const recentSessions = [
  {
    id: 1,
    mentorName: 'Sarah Johnson',
    studentName: 'John Smith',
    subject: 'Mathematics',
    date: '2025-05-18',
    duration: '60 minutes',
    amount: 40,
  },
  {
    id: 2,
    mentorName: 'Emily Chen',
    studentName: 'Michael Brown',
    subject: 'English Literature',
    date: '2025-05-17',
    duration: '45 minutes',
    amount: 35,
  },
  {
    id: 3,
    mentorName: 'David Wilson',
    studentName: 'Emily Johnson',
    subject: 'Computer Science',
    date: '2025-05-16',
    duration: '90 minutes',
    amount: 75,
  },
];

const reportedIssues = [
  {
    id: 1,
    reportedBy: 'John Smith',
    concerningUser: 'Unknown User',
    issueType: 'Technical Problem',
    description: 'Video session keeps disconnecting during tutoring sessions',
    date: '2025-05-17',
    status: 'Open',
    priority: 'High',
  },
  {
    id: 2,
    reportedBy: 'Emily Johnson',
    concerningUser: 'Robert Thomas',
    issueType: 'User Conduct',
    description: 'Mentor was repeatedly late to scheduled sessions',
    date: '2025-05-16',
    status: 'Under Review',
    priority: 'Medium',
  },
  {
    id: 3,
    reportedBy: 'David Wilson',
    concerningUser: 'Payment System',
    issueType: 'Payment Issue',
    description: 'Payment was processed but not reflected in account balance',
    date: '2025-05-15',
    status: 'Resolved',
    priority: 'Medium',
  },
];

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const AdminDashboard = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { toast } = useToast();

  const handleVerifyMentor = (mentorId: number) => {
    // In a real app, this would verify the mentor in the database
    toast({
      title: "Mentor verified",
      description: "The mentor has been verified and notified.",
    });
  };

  const handleRejectMentor = (mentorId: number) => {
    // In a real app, this would reject the mentor in the database
    toast({
      title: "Verification rejected",
      description: "The mentor has been notified about the rejection.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-gray-900 text-white py-4 px-6 shadow-sm">
        <div className="container-tight flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="mr-8">
              <img 
                src="/lovable-uploads/fd84ccc3-d993-4d2a-b179-a79cbae53518.png" 
                alt="Homentor Logo" 
                className="h-8"
              />
            </Link>
            <div className="bg-gray-800 text-gray-200 px-3 py-1 rounded text-sm font-medium">
              Admin Panel
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-gray-700 text-gray-200 hover:bg-gray-800">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <div className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="ml-2 hidden sm:inline">Admin User</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar and Content Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <div className="space-y-1">
              <div className="px-3 py-2 bg-gray-100 text-gray-900 rounded-md font-medium flex items-center">
                <LineChart className="h-4 w-4 mr-2" />
                Dashboard
              </div>
              <Link to="/admin/users" className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Users Management
              </Link>
              <Link to="/admin/mentors" className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md flex items-center">
                <User className="h-4 w-4 mr-2" />
                Mentor Verification
              </Link>
              <Link to="/admin/sessions" className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Sessions
              </Link>
              <Link to="/admin/subjects" className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Subjects & Courses
              </Link>
              <Link to="/admin/reports" className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Reports & Issues
              </Link>
              <Link to="/admin/settings" className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Platform Settings
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor and manage the Homentor platform</p>
          </div>
          
          {/* Stats Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <h3 className="text-2xl font-bold">{platformStats.totalUsers.toLocaleString()}</h3>
                    <p className="text-xs text-green-600">+{platformStats.growthRate}% from last month</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-md">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Mentors</p>
                    <h3 className="text-2xl font-bold">{platformStats.totalMentors}</h3>
                    <p className="text-xs text-gray-600">{platformStats.verifiedMentors} verified</p>
                  </div>
                  <div className="bg-purple-100 p-2 rounded-md">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Sessions</p>
                    <h3 className="text-2xl font-bold">{platformStats.totalSessions.toLocaleString()}</h3>
                    <p className="text-xs text-gray-600">Across {platformStats.activeSubjects} subjects</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-md">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Platform Revenue</p>
                    <h3 className="text-2xl font-bold">${platformStats.totalEarnings.toLocaleString()}</h3>
                    <p className="text-xs text-green-600">+12.3% from last month</p>
                  </div>
                  <div className="bg-amber-100 p-2 rounded-md">
                    <LineChart className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tab Sections */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="mentors">Mentors</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Mentor Verification Requests</h2>
                    {pendingVerifications.length > 0 ? (
                      <div className="space-y-4">
                        {pendingVerifications.map(mentor => (
                          <div key={mentor.id} className="flex items-start p-4 border border-gray-100 rounded-lg hover:border-homentor-blue transition-colors">
                            <div className="mr-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={mentor.image} alt={mentor.name} />
                                <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-medium">{mentor.name}</h3>
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                  Pending
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 mb-1">
                                Subjects: {mentor.subjects.join(', ')}
                              </div>
                              <div className="text-sm text-gray-600 mb-3">
                                Submitted: {formatDate(mentor.submittedDate)} • {mentor.documentType}
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleVerifyMentor(mentor.id)}
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verify
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-gray-300"
                                  onClick={() => handleRejectMentor(mentor.id)}
                                >
                                  Reject
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-gray-300"
                                >
                                  View Documents
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="text-center mt-2">
                          <Link to="/admin/mentors">
                            <Button variant="outline">View All Verification Requests</Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">No pending verification requests</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
                    {recentSessions.map(session => (
                      <div key={session.id} className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0">
                        <div>
                          <div className="font-medium">{session.subject}</div>
                          <div className="text-sm text-gray-500">
                            {session.mentorName} → {session.studentName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(session.date)} • {session.duration}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${session.amount}</div>
                          <Button size="sm" variant="ghost" className="h-8 px-2">
                            Details
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="text-center mt-4">
                      <Link to="/admin/sessions">
                        <Button variant="outline">View All Sessions</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Reported Issues</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left p-3 text-sm font-semibold text-gray-700">Issue</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700">Reported By</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700">Type</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700">Date</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportedIssues.map(issue => (
                          <tr key={issue.id} className="border-b border-gray-100 last:border-0">
                            <td className="p-3">
                              <div className="font-medium">{issue.description.substring(0, 30)}...</div>
                              <div className="text-xs text-gray-500">Concerning: {issue.concerningUser}</div>
                            </td>
                            <td className="p-3 text-sm">{issue.reportedBy}</td>
                            <td className="p-3 text-sm">{issue.issueType}</td>
                            <td className="p-3 text-sm">{formatDate(issue.date)}</td>
                            <td className="p-3">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                issue.status === 'Open'
                                  ? 'bg-red-100 text-red-800'
                                  : issue.status === 'Under Review'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {issue.status}
                              </span>
                            </td>
                            <td className="p-3">
                              <Button size="sm" variant="ghost" className="h-8 px-2">
                                Review
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-center mt-4">
                    <Link to="/admin/reports">
                      <Button variant="outline">View All Reports</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Mentors Tab */}
            <TabsContent value="mentors" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Mentor Management</h2>
                    <div className="flex space-x-2">
                      <div className="relative w-64">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input placeholder="Search mentors..." className="pl-8" />
                      </div>
                      <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Filter by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Mentors</SelectItem>
                          <SelectItem value="verified">Verified</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left p-3 text-sm font-semibold text-gray-700">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="select-all" />
                              <label htmlFor="select-all" className="text-sm font-semibold">Mentor</label>
                            </div>
                          </th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700">Subjects</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700">Rating</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700">Joined Date</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentMentors.map(mentor => (
                          <tr key={mentor.id} className="border-b border-gray-100 last:border-0">
                            <td className="p-3">
                              <div className="flex items-center space-x-3">
                                <Checkbox id={`select-${mentor.id}`} />
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={mentor.image} alt={mentor.name} />
                                  <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{mentor.name}</span>
                              </div>
                            </td>
                            <td className="p-3 text-sm">{mentor.subjects.join(', ')}</td>
                            <td className="p-3 text-sm">{mentor.rating}/5</td>
                            <td className="p-3 text-sm">{formatDate(mentor.joinedDate)}</td>
                            <td className="p-3">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                mentor.isVerified
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {mentor.isVerified ? 'Verified' : 'Pending'}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="ghost" className="h-8 px-2">
                                  View
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 px-2">
                                  Edit
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-500">
                      Showing 3 of {platformStats.totalMentors} mentors
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" disabled>Previous</Button>
                      <Button variant="outline" size="sm">Next</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Students Tab */}
            <TabsContent value="students">
              <Card>
                <CardContent className="py-10 text-center">
                  <h3 className="text-lg font-medium">Student Management</h3>
                  <p className="text-gray-500 mt-2">This section is under construction</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Reports Tab */}
            <TabsContent value="reports">
              <Card>
                <CardContent className="py-10 text-center">
                  <h3 className="text-lg font-medium">Platform Reports</h3>
                  <p className="text-gray-500 mt-2">This section is under construction</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

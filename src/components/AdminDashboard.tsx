import { useState } from "react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Users, 
  MessageSquare, 
  Database, 
  TrendingUp, 
  Activity, 
  FileText,
  Search,
  LogOut,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  Clock
} from "lucide-react";
import sabancıLogo from "../assets/sabanci_logo.png";
import { categories } from "../lib/mockData";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "faculty" | "staff";
  conversationsCount: number;
  messagesCount: number;
  lastActive: string;
  joinedDate: string;
}

interface AdminConversation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  title: string;
  category: string;
  messagesCount: number;
  timestamp: string;
  avgConfidence: number;
}

interface KnowledgeDocument {
  id: string;
  title: string;
  type: "pdf" | "webpage" | "handbook" | "database";
  department: string;
  size: string;
  lastUpdated: string;
  citationCount: number;
  status: "active" | "archived" | "pending";
}

// Mock data for admin dashboard
const mockAdminUsers: AdminUser[] = [
  {
    id: "u1",
    name: "Ahmet Yılmaz",
    email: "ahmet.yilmaz@sabanciuniv.edu",
    role: "student",
    conversationsCount: 15,
    messagesCount: 48,
    lastActive: "2 hours ago",
    joinedDate: "Sep 2024"
  },
  {
    id: "u2",
    name: "Ayşe Demir",
    email: "ayse.demir@sabanciuniv.edu",
    role: "student",
    conversationsCount: 8,
    messagesCount: 22,
    lastActive: "5 hours ago",
    joinedDate: "Sep 2024"
  },
  {
    id: "u3",
    name: "Dr. Mehmet Kaya",
    email: "mehmet.kaya@sabanciuniv.edu",
    role: "faculty",
    conversationsCount: 12,
    messagesCount: 35,
    lastActive: "1 day ago",
    joinedDate: "Aug 2023"
  },
  {
    id: "u4",
    name: "Zeynep Özkan",
    email: "zeynep.ozkan@sabanciuniv.edu",
    role: "staff",
    conversationsCount: 6,
    messagesCount: 18,
    lastActive: "3 hours ago",
    joinedDate: "Jan 2024"
  }
];

const mockAdminConversations: AdminConversation[] = [
  {
    id: "c1",
    userId: "u1",
    userName: "Ahmet Yılmaz",
    userEmail: "ahmet.yilmaz@sabanciuniv.edu",
    title: "Admission Requirements 2025",
    category: "admissions",
    messagesCount: 6,
    timestamp: "2 hours ago",
    avgConfidence: 0.95
  },
  {
    id: "c2",
    userId: "u2",
    userName: "Ayşe Demir",
    userEmail: "ayse.demir@sabanciuniv.edu",
    title: "Course Registration Questions",
    category: "academics",
    messagesCount: 4,
    timestamp: "5 hours ago",
    avgConfidence: 0.92
  },
  {
    id: "c3",
    userId: "u1",
    userName: "Ahmet Yılmaz",
    userEmail: "ahmet.yilmaz@sabanciuniv.edu",
    title: "Library Hours & Resources",
    category: "facilities",
    messagesCount: 3,
    timestamp: "1 day ago",
    avgConfidence: 0.96
  },
  {
    id: "c4",
    userId: "u3",
    userName: "Dr. Mehmet Kaya",
    userEmail: "mehmet.kaya@sabanciuniv.edu",
    title: "Research Grant Information",
    category: "financial",
    messagesCount: 8,
    timestamp: "1 day ago",
    avgConfidence: 0.88
  }
];

const mockKnowledgeDocuments: KnowledgeDocument[] = [
  {
    id: "d1",
    title: "Undergraduate Admissions Guide 2025",
    type: "pdf",
    department: "Admissions Office",
    size: "2.4 MB",
    lastUpdated: "Jan 2025",
    citationCount: 142,
    status: "active"
  },
  {
    id: "d2",
    title: "Course Catalog 2025",
    type: "database",
    department: "Academic Affairs",
    size: "8.1 MB",
    lastUpdated: "Jan 2025",
    citationCount: 256,
    status: "active"
  },
  {
    id: "d3",
    title: "Tuition & Fees Schedule 2024-2025",
    type: "database",
    department: "Bursar's Office",
    size: "1.2 MB",
    lastUpdated: "Aug 2024",
    citationCount: 189,
    status: "active"
  },
  {
    id: "d4",
    title: "Student Handbook 2024-2025",
    type: "handbook",
    department: "Student Affairs",
    size: "5.6 MB",
    lastUpdated: "Aug 2024",
    citationCount: 98,
    status: "active"
  },
  {
    id: "d5",
    title: "Library Services & Hours",
    type: "webpage",
    department: "Library Services",
    size: "320 KB",
    lastUpdated: "Oct 2024",
    citationCount: 76,
    status: "active"
  }
];

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  // Calculate statistics
  const totalUsers = mockAdminUsers.length;
  const totalConversations = mockAdminUsers.reduce((sum, user) => sum + user.conversationsCount, 0);
  const totalMessages = mockAdminUsers.reduce((sum, user) => sum + user.messagesCount, 0);
  const totalDocuments = mockKnowledgeDocuments.length;
  const avgConfidence = (mockAdminConversations.reduce((sum, conv) => sum + conv.avgConfidence, 0) / mockAdminConversations.length * 100).toFixed(1);

  const filteredConversations = mockAdminConversations.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || conv.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredUsers = mockAdminUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredDocuments = mockKnowledgeDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={sabancıLogo} 
              alt="Sabancı Universitesi" 
              className="h-10 w-auto"
            />
            <div>
              <h1 className="flex items-center gap-2">
                Admin Dashboard
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <Activity className="h-3 w-3 mr-1" />
                  RAG System
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground">
                Monitor and manage the AI assistant platform
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Users</p>
                <p className="text-xl">{totalUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Conversations</p>
                <p className="text-xl">{totalConversations}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Messages</p>
                <p className="text-xl">{totalMessages}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                <Database className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Documents</p>
                <p className="text-xl">{totalDocuments}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Confidence</p>
                <p className="text-xl">{avgConfidence}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="conversations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="conversations">
              <MessageSquare className="h-4 w-4 mr-2" />
              Conversations
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="knowledge">
              <Database className="h-4 w-4 mr-2" />
              Knowledge Base
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Conversations Tab */}
          <TabsContent value="conversations" className="space-y-4">
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.slice(1).map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Conversation</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Messages</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredConversations.map((conv) => (
                      <TableRow key={conv.id}>
                        <TableCell>
                          <div>
                            <div className="text-sm">{conv.userName}</div>
                            <div className="text-xs text-muted-foreground">{conv.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate">{conv.title}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {categories.find(c => c.id === conv.category)?.icon}{" "}
                            {categories.find(c => c.id === conv.category)?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{conv.messagesCount}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={conv.avgConfidence >= 0.9 ? "default" : "secondary"}
                            className={conv.avgConfidence >= 0.9 ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" : ""}
                          >
                            {(conv.avgConfidence * 100).toFixed(0)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {conv.timestamp}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Conversations</TableHead>
                      <TableHead>Messages</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={
                              user.role === "faculty" 
                                ? "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300" 
                                : user.role === "staff"
                                ? "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                                : ""
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.conversationsCount}</TableCell>
                        <TableCell>{user.messagesCount}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {user.lastActive}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{user.joinedDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          </TabsContent>

          {/* Knowledge Base Tab */}
          <TabsContent value="knowledge" className="space-y-4">
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Citations</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="max-w-xs">
                          <div className="truncate">{doc.title}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {doc.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{doc.department}</TableCell>
                        <TableCell className="text-sm">{doc.size}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {doc.citationCount}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{doc.lastUpdated}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={doc.status === "active" ? "default" : "secondary"}
                            className={doc.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" : ""}
                          >
                            {doc.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6">
                <h3 className="mb-4">Popular Categories</h3>
                <div className="space-y-3">
                  {categories.slice(1).map((cat, index) => {
                    const count = mockAdminConversations.filter(c => c.category === cat.id).length;
                    const percentage = (count / mockAdminConversations.length) * 100;
                    return (
                      <div key={cat.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{cat.icon} {cat.label}</span>
                          <span className="text-sm">{count} ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4">User Distribution</h3>
                <div className="space-y-3">
                  {["student", "faculty", "staff"].map((role) => {
                    const count = mockAdminUsers.filter(u => u.role === role).length;
                    const percentage = (count / mockAdminUsers.length) * 100;
                    return (
                      <div key={role}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm capitalize">{role}</span>
                          <span className="text-sm">{count} ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-600" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4">Response Confidence Distribution</h3>
                <div className="space-y-3">
                  {[
                    { label: "Excellent (90-100%)", min: 0.9, color: "bg-green-600" },
                    { label: "Good (80-89%)", min: 0.8, color: "bg-blue-600" },
                    { label: "Fair (70-79%)", min: 0.7, color: "bg-yellow-600" },
                    { label: "Low (<70%)", min: 0, color: "bg-red-600" }
                  ].map((range) => {
                    const count = mockAdminConversations.filter(c => {
                      if (range.min === 0) return c.avgConfidence < 0.7;
                      if (range.min === 0.9) return c.avgConfidence >= 0.9;
                      if (range.min === 0.8) return c.avgConfidence >= 0.8 && c.avgConfidence < 0.9;
                      return c.avgConfidence >= 0.7 && c.avgConfidence < 0.8;
                    }).length;
                    const percentage = (count / mockAdminConversations.length) * 100;
                    return (
                      <div key={range.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{range.label}</span>
                          <span className="text-sm">{count} ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${range.color}`} 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4">Top Documents by Citations</h3>
                <div className="space-y-3">
                  {mockKnowledgeDocuments
                    .sort((a, b) => b.citationCount - a.citationCount)
                    .slice(0, 5)
                    .map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm truncate">{doc.title}</div>
                          <div className="text-xs text-muted-foreground">{doc.department}</div>
                        </div>
                        <Badge variant="secondary">
                          {doc.citationCount}
                        </Badge>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

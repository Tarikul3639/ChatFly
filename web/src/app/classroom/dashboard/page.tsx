"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BotMessageSquare, Plus, Users, Bell, Settings, Search, BookOpen, Clock, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"

// Define types
interface User {
  id: number;
  name: string;
  email?: string;
  role?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const sidebar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // const userData = localStorage.getItem("chatfly-user")
    const userData = { id: 1, name: "John Doe" }
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(userData)
  }, [router])

  // Outside click handler to close sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!sidebar.current) return
      if (sidebar.current && !sidebar.current.contains(event.target as Node)) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [sidebarOpen])

  const classrooms = [
    {
      id: 1,
      name: "Mathematics 101",
      description: "Advanced calculus and algebra",
      members: 24,
      unread: 3,
      lastActivity: "2 min ago",
      color: "bg-blue-500",
    },
    {
      id: 2,
      name: "Physics Lab",
      description: "Experimental physics discussions",
      members: 18,
      unread: 0,
      lastActivity: "1 hour ago",
      color: "bg-green-500",
    },
    {
      id: 3,
      name: "Computer Science",
      description: "Programming and algorithms",
      members: 32,
      unread: 7,
      lastActivity: "5 min ago",
      color: "bg-purple-500",
    },
    {
      id: 4,
      name: "Literature Club",
      description: "Book discussions and analysis",
      members: 15,
      unread: 1,
      lastActivity: "30 min ago",
      color: "bg-orange-500",
    },
    {
      id: 5,
      name: "History Society",
      description: "World history and events",
      members: 20,
      unread: 0,
      lastActivity: "1 day ago",
      color: "bg-red-500",
    },
    {
      id: 6,
      name: "Art Appreciation",
      description: "Exploring art and creativity",
      members: 12,
      unread: 2,
      lastActivity: "15 min ago",
      color: "bg-pink-500",
    },
    {
      id: 7,
      name: "Chemistry Corner",
      description: "Chemical reactions and experiments",
      members: 22,
      unread: 0,
      lastActivity: "3 hours ago",
      color: "bg-yellow-500",
    },
    {
      id: 8,
      name: "Philosophy Forum",
      description: "Deep discussions on philosophical topics",
      members: 10,
      unread: 4,
      lastActivity: "10 min ago",
      color: "bg-teal-500",
    },
    {
      id: 9,
      name: "Music Theory",
      description: "Understanding the fundamentals of music",
      members: 14,
      unread: 1,
      lastActivity: "2 hours ago",
      color: "bg-indigo-500",
    },
    {
      id: 10,
      name: "Environmental Science",
      description: "Sustainability and ecological studies",
      members: 16,
      unread: 0,
      lastActivity: "1 week ago",
      color: "bg-gray-500",
    },
    {
      id: 11,
      name: "Economics 101",
      description: "Basic principles of economics",
      members: 19,
      unread: 5,
      lastActivity: "20 min ago",
      color: "bg-blue-600",
    },
    {
      id: 12,
      name: "Political Science",
      description: "Discussions on governance and policies",
      members: 17,
      unread: 0,
      lastActivity: "4 hours ago",
      color: "bg-green-600",
    }
  ]

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Sidebar */}
      <div ref={sidebar} className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-10 ${sidebarOpen ? 'block' : 'max-sm:hidden'}`}>
        <div className="flex flex-col h-screen">
          <Link href="/" className="flex items-center space-x-2 shrink-0 border-b border-gray-200 p-6 pb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <BotMessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ChatFly
            </span>
          </Link>

          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider py-3 px-6 border-b border-gray-200">My Classrooms</h3>
          <div className="space-y-2 flex-1 overflow-y-auto px-6">
            {classrooms.map((classroom) => (
              <Link key={classroom.id} href={`/classroom/${classroom.id}`}>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer group">
                  <div className={`w-3 h-3 rounded-full ${classroom.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{classroom.name}</p>
                    <p className="text-xs text-gray-500 truncate">{classroom.members} members</p>
                  </div>
                  {classroom.unread > 0 && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-600 text-xs">
                      {classroom.unread}
                    </Badge>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="sm:pl-64 h-screen flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button  variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)} className="sm:hidden">
                <span className="sr-only">Toggle sidebar</span>
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="hidden md:block text-2xl font-bold text-gray-900">Dashboard</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search classrooms..." className="pl-10 w-64" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              </Button>
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
              <Avatar className="cursor-pointer">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name || "User"}! 👋</h2>
              <p className="text-gray-600">
                You have {classrooms.filter((c) => c.unread > 0).length} classrooms with new messages
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Create Classroom</span>
                  </CardTitle>
                  <CardDescription className="text-blue-100">Start a new classroom and invite students</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/classroom/create-classroom">
                    <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <span>Join Classroom</span>
                  </CardTitle>
                  <CardDescription>Enter a classroom code to join</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Input placeholder="Enter classroom code" className="flex-1" />
                    <Button className="bg-green-600 hover:bg-green-700">Join</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Classrooms Grid */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Classrooms</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classrooms.map((classroom) => (
                  <Link key={classroom.id} href={`/classroom/${classroom.id}`}>
                    <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer group">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div
                            className={`w-12 h-12 ${classroom.color} rounded-xl flex items-center justify-center mb-3`}
                          >
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          {classroom.unread > 0 && (
                            <Badge className="bg-red-100 text-red-600">{classroom.unread} new</Badge>
                          )}
                        </div>
                        <CardTitle className="group-hover:text-blue-600 transition-colors">{classroom.name}</CardTitle>
                        <CardDescription>{classroom.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{classroom.members} members</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{classroom.lastActivity}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your classrooms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New message in Mathematics 101</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Assignment posted in Computer Science</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New member joined Physics Lab</p>
                      <p className="text-xs text-gray-500">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

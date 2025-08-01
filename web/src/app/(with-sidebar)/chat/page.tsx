"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  MessageCircle,
  Search,
  Plus,
  Phone,
  Video,
  MoreHorizontal,
  Send,
  Smile,
  Paperclip,
} from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // const userData = localStorage.getItem("chatfly-user")
    const userData = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "student",
    };
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(userData)
  }, [router])

  const chats = [
    {
      id: 1,
      name: "Mathematics 101",
      type: "classroom",
      lastMessage: "Dr. Smith: Great question about derivatives!",
      timestamp: "2 min",
      unread: 3,
      avatar: "M1",
      online: true,
      members: 24,
    },
    {
      id: 2,
      name: "Physics Lab",
      type: "classroom",
      lastMessage: "Alice: When is the next lab session?",
      timestamp: "1h",
      unread: 0,
      avatar: "PL",
      online: true,
      members: 18,
    },
    {
      id: 3,
      name: "Dr. Smith",
      type: "direct",
      lastMessage: "Please review chapter 5 for tomorrow",
      timestamp: "3h",
      unread: 1,
      avatar: "DS",
      online: true,
    },
    {
      id: 4,
      name: "Study Group",
      type: "group",
      lastMessage: "Bob: Anyone free for study session?",
      timestamp: "5h",
      unread: 0,
      avatar: "SG",
      online: false,
      members: 6,
    },
    {
      id: 5,
      name: "Computer Science",
      type: "classroom",
      lastMessage: "Assignment due tomorrow!",
      timestamp: "1d",
      unread: 7,
      avatar: "CS",
      online: true,
      members: 32,
    },
    {
      id: 6,
      name: "Group Project",
      type: "group",
      lastMessage: "Let's finalize the presentation slides",
      timestamp: "2d",
      unread: 2,
      avatar: "GP",
      online: false,
      members: 10,
    },
    {
      id: 7,
      name: "History Discussion",
      type: "classroom",
      lastMessage: "Discussion on World War II",
      timestamp: "3d",
      unread: 0,
      avatar: "HD",
      online: false,
      members: 15,
    },
    {
      id: 8,
      name: "Chemistry Club",
      type: "group",
      lastMessage: "Next meeting on Friday",
      timestamp: "4d",
      unread: 0,
      avatar: "CC",
      online: false,
      members: 20,
    },
    {
      id: 9,
      name: "Art Class",
      type: "classroom",
      lastMessage: "Don't forget to bring your sketchbooks!",
      timestamp: "5d",
      unread: 0,
      avatar: "AC",
      online: false,
      members: 12,
    },
    {
      id: 10,
      name: "Music Theory",
      type: "classroom",
      lastMessage: "Practice your scales for next week",
      timestamp: "6d",
      unread: 0,
      avatar: "MT",
      online: false,
      members: 8,
    },
  ]

  if (!user) return null

  return (
    <div className="h-screen bg-white flex">
      {/* Chat List */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Chats</h2>
            <Button size="icon" variant="ghost" className="text-gray-500">
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search conversations..." className="pl-10 bg-gray-100 border-0 focus:bg-white" />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => router.push(`/chat/${chat.id}`)}
              className="p-4 border-b border-gray-100 cursor-pointer hover:bg-white transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback
                      className={`${
                        chat.type === "classroom"
                          ? "bg-blue-100 text-blue-600"
                          : chat.type === "group"
                            ? "bg-green-100 text-green-600"
                            : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {chat.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {chat.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500">{chat.timestamp}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <Badge className="bg-blue-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>

                  {chat.members && <p className="text-xs text-gray-400 mt-1">{chat.members} members</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Welcome Screen */}
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ChatFly</h2>
            <p className="text-gray-600 mb-6">
              Select a conversation from the sidebar to start chatting with your classmates and teachers.
            </p>
            <Link href="/classroom/create-classroom">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Create New Classroom
              </Button>
            </Link>
          </div>
        </div>
      </div>  
    </div>
  )
}

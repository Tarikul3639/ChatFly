"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Phone,
  Video,
  MoreHorizontal,
  Send,
  Smile,
  Paperclip,
  ArrowLeft,
} from "lucide-react"

// Define types
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Chat {
  id: number;
  name: string;
  type: string;
  avatar: string;
  online: boolean;
  members?: number;
}

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  avatar: string;
  isOwn: boolean;
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [user, setUser] = useState<User | null>(null)
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState<Chat | null>(null)

  // Sample chat data (you can replace with API call) - memoized to prevent re-renders
  const chats = useMemo(() => [
    {
      id: 1,
      name: "Mathematics 101",
      type: "classroom",
      avatar: "M1",
      online: true,
      members: 24,
    },
    {
      id: 2,
      name: "Physics Lab",
      type: "classroom",
      avatar: "PL",
      online: true,
      members: 18,
    },
    {
      id: 3,
      name: "Dr. Smith",
      type: "direct",
      avatar: "DS",
      online: true,
    },
    {
      id: 4,
      name: "Study Group",
      type: "group",
      avatar: "SG",
      online: false,
      members: 6,
    },
    {
      id: 5,
      name: "Computer Science",
      type: "classroom",
      avatar: "CS",
      online: true,
      members: 32,
    },
  ], []);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "Dr. Smith",
      content: "Good morning everyone! Today we'll be covering advanced calculus concepts.",
      timestamp: "10:30 AM",
      avatar: "DS",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      content: "Thank you professor! I'm ready to learn.",
      timestamp: "10:32 AM",
      avatar: "YU",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Alice Johnson",
      content: "Could you explain the chain rule again? I'm still confused about it.",
      timestamp: "10:35 AM",
      avatar: "AJ",
      isOwn: false,
    },
    {
      id: 4,
      sender: "Bob",
      content: "I'm having trouble with the last assignment.",
      timestamp: "10:40 AM",
      avatar: "BO",
      isOwn: false,
    },
    {
      id: 5,
      sender: "You",
      content: "No problem, Bob! Let's go over it together after class.",
      timestamp: "10:42 AM",
      avatar: "YU",
      isOwn: true,
    },
  ])

  useEffect(() => {
    // Check if user is logged in
    const userData = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "student",
    }
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(userData)

    // Find the specific chat based on chatId
    const chatId = Number(params.chatId)
    const foundChat = chats.find(c => c.id === chatId)
    if (foundChat) {
      setChat(foundChat)
    }
  }, [params.chatId, router, chats])

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })

    const newMessage = {
      id: messages.length + 1,
      sender: "You",
      content: message,
      timestamp: currentTime,
      avatar: "YU",
      isOwn: true,
    }

    setMessages([...messages, newMessage])
    setMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!user || !chat) return null

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => router.back()}
              className="lg:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <Avatar className="w-10 h-10">
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
            <div>
              <h3 className="font-semibold text-gray-900">{chat.name}</h3>
              <p className="text-sm text-gray-500">
                {chat.online ? "Active now" : "Last seen 2h ago"}
                {chat.members && ` • ${chat.members} members`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button size="icon" variant="ghost">
              <Phone className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost">
              <Video className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
            <div
              className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${msg.isOwn ? "flex-row-reverse space-x-reverse" : ""}`}
            >
              {!msg.isOwn && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">{msg.avatar}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-2xl px-4 py-2 ${
                  msg.isOwn
                    ? "bg-blue-500 text-white rounded-br-sm"
                    : "bg-white text-gray-900 rounded-bl-sm shadow-sm"
                }`}
              >
                {!msg.isOwn && <p className="text-xs font-medium mb-1 text-gray-500">{msg.sender}</p>}
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.isOwn ? "text-blue-100" : "text-gray-500"}`}>{msg.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <Button size="icon" variant="ghost" className="text-gray-500">
            <Paperclip className="w-5 h-5" />
          </Button>

          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="pr-20 rounded-full border-gray-300 focus:border-blue-500"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500">
                <Smile className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button 
            size="icon" 
            className="bg-blue-500 hover:bg-blue-600 rounded-full" 
            disabled={!message.trim()}
            onClick={handleSendMessage}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

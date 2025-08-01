"use client";

import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Phone,
  Video,
  MoreHorizontal,
  Send,
  Smile,
  Paperclip,
  ArrowLeft,
  BotMessageSquare,
} from "lucide-react";
import ChatList from "./components/ChatList";

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

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}

function ChatPageContent() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Chat data - memoized to prevent re-renders
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

  // Messages state
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
  ]);

  // Handle back to chat list (mobile)
  const handleBackToList = () => {
    setSelectedChat(null);
    router.push('/chat', { scroll: false });
  };

  // Handle chat selection - Update URL and set selected chat
  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    // Update URL with query parameter instead of routing to new page
    router.push(`/chat?id=${chat.id}`, { scroll: false });
  };

  // Handle sending message
  const handleSendMessage = () => {
    if (!message.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit", 
      hour12: true,
    });

    const newMessage = {
      id: messages.length + 1,
      sender: "You",
      content: message,
      timestamp: currentTime,
      avatar: "YU",
      isOwn: true,
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    // const userData = localStorage.getItem("chatfly-user")
    const userData = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "student",
    };
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(userData);

    // Check for chat ID in URL and set selected chat
    const chatId = searchParams.get('id');
    if (chatId) {
      const foundChat = chats.find(c => c.id === Number(chatId));
      if (foundChat) {
        setSelectedChat(foundChat);
      }
    }
  }, [router, searchParams, chats]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) return null;

  return (
    <div className={`h-screen bg-white flex pb-16 sm:pb-0 ${selectedChat ? 'max-sm:fixed max-sm:inset-0 max-sm:z-50' : ''}`}>
      {/* Sidebar - Hidden on mobile when chat is selected */}
      <div className={`${selectedChat ? 'hidden sm:block sm:w-80' : 'block w-full sm:w-80'}`}>
        <ChatList
          onChatSelect={handleChatSelect}
          selectedChatId={selectedChat?.id}
        />
      </div>

      {/* Main Chat Area - Hidden on mobile when no chat selected */}
      <div className={`flex-1 flex flex-col h-screen ${!selectedChat ? 'hidden sm:flex' : 'flex'}`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Back button for mobile */}
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="md:hidden"
                    onClick={handleBackToList}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  
                  <Avatar className="w-10 h-10 text-base font-semibold">
                    <AvatarFallback
                      className={`${
                        selectedChat.type === "classroom"
                          ? "bg-blue-100 text-blue-600"
                          : selectedChat.type === "group"
                            ? "bg-green-100 text-green-600"
                            : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {selectedChat.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedChat.online ? "Active now" : "Last seen 2h ago"}
                      {selectedChat.members && ` • ${selectedChat.members} members`}
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
            <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex items-end space-x-2 max-w-[85%] md:max-w-xs lg:max-w-md ${msg.isOwn ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    {!msg.isOwn && (
                      <Avatar className="w-6 h-6 md:w-8 md:h-8 text-base font-semibold flex-shrink-0">
                        <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">{msg.avatar}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-2xl px-3 md:px-4 py-2 ${
                        msg.isOwn
                          ? "bg-blue-500 text-white rounded-br-sm"
                          : "bg-white text-gray-900 rounded-bl-sm shadow-sm"
                      }`}
                    >
                      {!msg.isOwn && <p className="text-xs font-medium mb-1 text-gray-500">{msg.sender}</p>}
                      <p className="text-sm break-words">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.isOwn ? "text-blue-100" : "text-gray-500"}`}>{msg.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-2 md:p-4">
              <div className="flex items-center space-x-2 md:space-x-3">
                <Button size="icon" variant="ghost" className="text-gray-500 hidden md:flex">
                  <Paperclip className="w-5 h-5" />
                </Button>

                <div className="flex-1 relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="pr-12 md:pr-20 rounded-full border-gray-300 focus:border-blue-500"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500">
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button 
                  size="icon" 
                  className="bg-blue-500 hover:bg-blue-600 rounded-full w-10 h-10 md:w-9 md:h-9" 
                  disabled={!message.trim()}
                  onClick={handleSendMessage}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
            <div className="text-center max-w-md">
              <div className="w-16 md:w-24 h-16 md:h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <BotMessageSquare className="w-8 md:w-12 h-8 md:h-12 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Welcome to ChatFly
              </h2>
              <p className="text-gray-600 mb-2 text-sm md:text-base">
                Select a conversation from the sidebar to start chatting with your
                classmates and teachers.
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                {user?.name}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Phone,
  Video,
  MoreHorizontal,
  Send,
  Smile,
  Paperclip,
  ArrowLeft,
  BotMessageSquare,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Mic,
} from "lucide-react";
import ChatList from "./components/ChatList";
import { Textarea } from "@/components/ui/textarea";

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
    <Suspense
      fallback={
        <div className="h-screen bg-white flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}

function ChatPageContent() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 120); // Max 120px height
      textarea.style.height = newHeight + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        handleSendMessage();
      }
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Add voice recording logic here
  };

  // Chat data - memoized to prevent re-renders
  const chats = useMemo(
    () => [
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
    ],
    []
  );

  const aiSuggestions = [
    "That's a great explanation! Could you provide an example?",
    "I understand now, thank you for clarifying!",
    "Could you elaborate on that concept a bit more?",
  ];

  // Messages state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "Dr. Smith",
      content:
        "Good morning everyone! Today we'll be covering advanced calculus concepts.",
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
      content:
        "Could you explain the chain rule again? I'm still confused about it.",
      timestamp: "10:35 AM",
      avatar: "AJ",
      isOwn: false,
    },
  ]);

  // Handle back to chat list (mobile)
  const handleBackToList = () => {
    setSelectedChat(null);
    router.push("/chat", { scroll: false });
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
    inputRef?.current?.focus();
  };

  const handleAISuggestion = (suggestion: string) => {
    setMessage(suggestion);
    setShowAISuggestions(false);
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
    const chatId = searchParams.get("id");
    if (chatId) {
      const foundChat = chats.find((c) => c.id === Number(chatId));
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
    <div
      className={`h-screen bg-white flex pb-16 sm:pb-0 ${
        selectedChat ? "max-sm:fixed max-sm:inset-0 max-sm:z-50" : ""
      }`}
    >
      {/* Sidebar - Hidden on mobile when chat is selected */}
      <div
        className={`${
          selectedChat ? "hidden sm:block sm:w-80" : "block w-full sm:w-80"
        }`}
      >
        <ChatList
          onChatSelect={handleChatSelect}
          selectedChatId={selectedChat?.id}
        />
      </div>

      {/* Main Chat Area - Hidden on mobile when no chat selected */}
      <div
        className={`flex-1 flex flex-col h-screen z-50 ${
          !selectedChat ? "hidden sm:flex" : "flex"
        }`}
      >
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
                    <h3 className="font-semibold text-gray-900">
                      {selectedChat.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedChat.online ? "Active now" : "Last seen 2h ago"}
                      {selectedChat.members &&
                        ` • ${selectedChat.members} members`}
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
            <div
              className={`flex-1 overflow-y-auto p-2 md:p-4 space-y-4 bg-gray-50`}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.isOwn ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-end space-x-2 max-w-[85%] md:max-w-xs lg:max-w-md ${
                      msg.isOwn ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    {!msg.isOwn && (
                      <Avatar className="w-6 h-6 md:w-8 md:h-8 text-base font-semibold flex-shrink-0">
                        <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                          {msg.avatar}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-2xl px-3 md:px-4 py-2 ${
                        msg.isOwn
                          ? "bg-blue-500 text-white rounded-br-sm"
                          : "bg-white text-gray-900 rounded-bl-sm shadow-sm"
                      }`}
                    >
                      {!msg.isOwn && (
                        <p className="text-xs font-medium mb-1 text-gray-500">
                          {msg.sender}
                        </p>
                      )}
                      <p className="text-sm break-words whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.isOwn ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-3 md:p-4 safe-area-bottom">
              <div className="flex items-end space-x-2 max-w-4xl mx-auto">
                {/* Attachment Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-700 flex-shrink-0 mb-1 h-9 w-9"
                >
                  <Paperclip className="w-5 h-5" />
                </Button>

                {/* Input Container */}
                <div className="flex-1 relative">
                  <div className="flex items-end bg-gray-100 hover:bg-gray-200 transition-colors rounded-2xl px-4 py-2 min-h-[44px]">
                    <Textarea
                      ref={textareaRef}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        adjustTextareaHeight();
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder={"Type a message..."}
                      className="flex-1 bg-transparent border-0 resize-none min-h-[28px] max-h-[120px] text-sm md:text-base placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 leading-6 hide-scrollbar shadow-none"
                      rows={1}
                    />

                    {/* Right side action buttons */}
                    <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                      {/* Emoji Button */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-300 rounded-full"
                      >
                        <Smile className="w-4 h-4" />
                      </Button>

                      {/* AI Suggestions Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAISuggestions(!showAISuggestions)}
                        className={`h-8 px-2 rounded-full transition-all ${
                          showAISuggestions
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                      </Button>

                      {/* Voice Record Button (shows when no text) */}
                      {!message.trim() && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleVoiceRecord}
                          className={`h-8 w-8 rounded-full transition-all ${
                            isRecording
                              ? "bg-red-500 text-white hover:bg-red-600"
                              : "text-gray-500 hover:text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          <Mic className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Send Button */}
                <Button
                  size="icon"
                  className={`rounded-full flex-shrink-0 h-11 w-11 transition-all duration-200 ${
                    message.trim()
                      ? "bg-blue-500 hover:bg-blue-600 scale-100 shadow-lg"
                      : "bg-gray-300 cursor-not-allowed scale-95"
                  }`}
                  disabled={!message.trim()}
                  onClick={handleSendMessage}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>

              {/* Character count indicator */}
              {message.length > 500 && (
                <div className="text-xs text-gray-400 text-right mt-2 px-2">
                  {message.length}/1000
                </div>
              )}
            </div>

            {/* AI Suggestions Bar */}
            {showAISuggestions && (
              <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    AI Suggestions
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleAISuggestion(suggestion)}
                      className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center space-x-2"
                    >
                      <span>{suggestion}</span>
                      <div className="flex space-x-1">
                        <ThumbsUp className="w-3 h-3 text-gray-400 hover:text-green-500 cursor-pointer" />
                        <ThumbsDown className="w-3 h-3 text-gray-400 hover:text-red-500 cursor-pointer" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                Select a conversation from the sidebar to start chatting with
                your classmates and teachers.
              </p>
              <p className="text-gray-600 text-sm md:text-base">{user?.name}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

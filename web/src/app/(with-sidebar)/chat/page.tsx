"use client";

import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ChatList from "./components/ChatList";
import MessageInput from "./components/MessageInput";
import Message from "./components/Message";
import ChatHeader from "./components/ChatHeader";
import Welcome from "./components/Welcome";

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

interface MessageType {
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
  const messagesEndRef = useRef<HTMLDivElement>(null!);
  const textareaRef = useRef<HTMLTextAreaElement>(null!);
  const [isRecording, setIsRecording] = useState(false);

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
  const [messages, setMessages] = useState<MessageType[]>([
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
    textareaRef?.current?.focus();
  };

  const handleAISuggestion = (suggestion: string) => {
    setMessage(suggestion);
    setShowAISuggestions(false);
    textareaRef?.current?.focus();
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
      className={`sm:h-screen bg-white flex ${
        selectedChat ? "max-sm:fixed max-sm:inset-0 max-sm:z-50" : "h-screen"
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
        className={`${
          selectedChat
            ? "flex flex-col flex-1"
            : "hidden sm:flex flex-col flex-1"
        }`}
      >
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <ChatHeader selectedChat={selectedChat} onBack={handleBackToList} />

            {/* Messages */}
            <Message messages={messages} messagesEndRef={messagesEndRef} />

            {/* Message Input */}
            <div className="flex-none bg-white border-t border-gray-200 safe-area-bottom">
              <MessageInput
                message={message}
                setMessage={setMessage}
                onSend={handleSendMessage}
                showAISuggestions={showAISuggestions}
                setShowAISuggestions={setShowAISuggestions}
                isRecording={isRecording}
                setIsRecording={setIsRecording}
                aiSuggestions={aiSuggestions}
                onAISuggestion={handleAISuggestion}
                textareaRef={textareaRef}
              />
            </div>
          </>
        ) : (
          <Welcome userName={user?.name} />
        )}
      </div>
    </div>
  );
}

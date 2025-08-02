"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import MessageInput from "../components/MessageInput";
import Message from "../components/Message";
import ChatHeader from "../components/ChatHeader";
import { Chat, MessageType, chats, sampleMessages } from "../types";

export default function ChatConversationPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const router = useRouter();
  const params = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null!);
  const textareaRef = useRef<HTMLTextAreaElement>(null!);

  const aiSuggestions = [
    "That's a great explanation! Could you provide an example?",
    "I understand now, thank you for clarifying!",
    "Could you elaborate on that concept a bit more?",
  ];

  // Sample messages - In real app, this would come from API based on chat ID
  const [messages, setMessages] = useState<MessageType[]>(sampleMessages);

  // Handle back to chat list (mobile)
  const handleBackToList = () => {
    router.push("/chat");
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

  // Find and set selected chat based on URL parameter
  useEffect(() => {
    if (params?.id) {
      const chatId = Number(params.id);
      const foundChat = chats.find((c) => c.id === chatId);
      if (foundChat) {
        setSelectedChat(foundChat);
      } else {
        // If chat not found, redirect to chat list
        router.push("/chat");
      }
    }
  }, [params?.id, router]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col z-50">
      {/* Chat Header */}
      <ChatHeader selectedChat={selectedChat} onBack={handleBackToList} />

      {/* Messages */}
      <Message messages={messages} messagesEndRef={messagesEndRef} />

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 safe-area-bottom">
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
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import MessageInput from "../components/MessageInput";
import Message from "../components/Message";
import ChatHeader from "../components/ChatHeader";
import ReplyPreview from "../components/ReplyPreview";
import { Chat, MessageType, chats, sampleMessages } from "../types";

export default function ChatConversationPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [replyingTo, setReplyingTo] = useState<MessageType | null>(null);
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
      replyTo: replyingTo || undefined,
    };

    setMessages([...messages, newMessage]);
    setMessage("");
    setReplyingTo(null); // Clear reply after sending
    textareaRef?.current?.focus();
  };

  const handleAISuggestion = (suggestion: string) => {
    setMessage(suggestion);
    setShowAISuggestions(false);
    textareaRef?.current?.focus();
  };

  // Handle reply to message
  const handleReply = (messageToReply: MessageType) => {
    setReplyingTo(messageToReply);
    textareaRef?.current?.focus();
  };

  // Cancel reply
  const cancelReply = () => {
    setReplyingTo(null);
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
      <div className="flex items-center justify-center h-[100dvh] w-[100dvw]">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-gray-500">Loading chat...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full z-50">
      {/* Chat Header */}
      <ChatHeader selectedChat={selectedChat} onBack={handleBackToList} />

      {/* Messages */}
      <Message 
        messages={messages} 
        messagesEndRef={messagesEndRef} 
        onReply={handleReply}
      />

      {/* Message Input */}
      <div className="flex-none bg-white border-t border-gray-200 safe-area-bottom">
        {/* Reply Preview */}
        {replyingTo && (
          <ReplyPreview 
            replyingTo={replyingTo} 
            onCancel={cancelReply} 
          />
        )}
        
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

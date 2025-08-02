"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Chat, chats } from "./types";
import ChatList from "./components/ChatList";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  // Handle chat selection
  const handleChatSelect = (chat: Chat) => {
    setSelectedChatId(chat.id);
    router.push(`/chat/${chat.id}`);
  };

  // Update selected chat when URL changes
  useEffect(() => {
    if (params?.id) {
      setSelectedChatId(Number(params.id));
    } else {
      setSelectedChatId(null);
    }
  }, [params?.id]);

  return (
    <div className="h-screen bg-white flex">
      {/* Chat List Sidebar - Always visible on desktop, conditional on mobile */}
      <div
        className={`${
          selectedChatId 
            ? "hidden sm:block sm:w-80" 
            : "block w-full sm:w-80"
        } border-r border-gray-200`}
      >
        <ChatList
          onChatSelect={handleChatSelect}
          selectedChatId={selectedChatId || undefined}
        />
      </div>

      {/* Chat Content Area */}
      <div
        className={`${
          selectedChatId
            ? "flex flex-col flex-1 z-50"
            : "hidden sm:flex flex-col flex-1"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

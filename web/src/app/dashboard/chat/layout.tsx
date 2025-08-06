"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Chat, chats } from "./types";
import { ChatList, Welcome } from "@/components/chat";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const user = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "student",
  };

  // Handle chat selection
  const handleChatSelect = (chat: Chat) => {
    setSelectedChatId(chat.id);
    router.push(`/dashboard/chat/${chat.id}`);
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
    <div className="sm:h-screen bg-white flex">
      {/* Chat List Sidebar - Always visible on desktop, conditional on mobile */}
      <div
        className={`${
          selectedChatId ? "hidden md:block sm:w-80" : "block w-full sm:w-80"
        } border-r border-gray-200 h-screen`}
      >
        <ChatList
          onChatSelect={handleChatSelect}
          selectedChatId={selectedChatId || undefined}
        />
      </div>
      {/* Main content area */}
      {selectedChatId ? (
        children
      ) : (
        <div className="hidden sm:flex w-full flex items-center justify-center">
          <Welcome userName={user.name} />
        </div>
      )}
    </div>
  );
}

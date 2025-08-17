"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useSocket } from "@/context/SocketContext";

// Chat type for callbacks
export interface Chat {
  _id: string;
  username: string;
  type?: "personal" | "group" | "classroom" | "unknown";
  avatar?: string;
  online?: boolean;
  members?: number;
  lastMessage?: string;
  unread?: number;
  timestamp?: string;
}

// ChatWithMessages type (used for internal list)
export interface ChatWithMessages extends Chat {
  lastMessage?: string;
  unread?: number;
  timestamp?: string;
  members?: number;
}

interface ChatListProps {
  onChatSelect?: (chat: Chat) => void;
  selectedChatId?: string;
}

export default function ChatList({
  onChatSelect,
  selectedChatId,
}: ChatListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { socket } = useSocket();

  const [chatList, setChatList] = useState<ChatWithMessages[]>([]);

  useEffect(() => {
    if (!socket) return;

    // Listen for response first
    socket.on("chatList", (conversations) => {
      console.log("Received chats:", conversations);
    });

    socket.on("chatListError", (msg) => {
      console.error(msg);
    });

    // Emit request after connection
    socket.emit("getChatList");

    // Cleanup
    return () => {
      socket.off("chatList");
      socket.off("chatListError");
    };
  }, [socket]);

  const handleSearching = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    socket?.emit("searchChats", e.target.value);
    socket?.on("searchChatsResult", (results) => {
      setChatList(results);
    });
  };

  // Filter chats based on search query
  const filteredChats = chatList.filter(
    (chat) =>
      chat.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat?.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatClick = (chat: ChatWithMessages) => {
    // Convert ChatWithMessages to Chat for the callback
    const chatForCallback: Chat = {
      _id: chat._id,
      username: chat.username,
      type: chat.type || "unknown",
      avatar: chat.avatar || "C",
      online: chat.online || false,
      members: chat.members || 0,
    };

    if (onChatSelect) {
      onChatSelect(chatForCallback);
    }
    // Update URL with chat ID using dynamic route
    router.push(`/dashboard/chat/${chat._id}`);
  };

  return (
    <div className="w-full md:w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-[calc(100dvh-4rem)] sm:h-[calc(100dvh)]">
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
          <Input
            placeholder="Search conversations..."
            className="pl-10 bg-gray-100 border-0 focus:bg-white"
            value={searchQuery}
            onChange={handleSearching}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-1">
        {filteredChats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => handleChatClick(chat)}
            className={`p-3 border-b border-gray-100 rounded-md cursor-pointer hover:bg-blue-100 transition-colors touch-manipulation ${
              selectedChatId === chat._id
                ? "border-l-4 bg-blue-100 border-x-blue-500"
                : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative flex-shrink-0">
                <Avatar className="w-10 md:w-12 h-10 md:h-12 font-semibold text-base">
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
                  <div className="absolute -bottom-1 -right-1 w-3 md:w-4 h-3 md:h-4 bg-green-400 border-2 border-white rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 truncate text-sm md:text-base">
                    {chat.username}
                  </h3>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {chat.timestamp}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs md:text-sm text-gray-600 truncate pr-2">
                    {chat.lastMessage}
                  </p>
                  {chat.unread && chat.unread > 0 && (
                    <Badge className="bg-blue-500 text-white text-xs min-w-[18px] md:min-w-[20px] h-4 md:h-5 flex items-center justify-center flex-shrink-0">
                      {chat?.unread}
                    </Badge>
                  )}
                </div>

                {chat.members && (
                  <p className="text-xs text-gray-400 mt-1">
                    {chat.members} members
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

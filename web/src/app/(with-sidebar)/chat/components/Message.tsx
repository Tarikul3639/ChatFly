import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EllipsisVertical, Reply, Pin, Edit, Trash2 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  avatar: string;
  isOwn: boolean;
  replyTo?: Message;
}

interface MessageProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onReply?: (message: Message) => void;
}

export default function Message({ messages, messagesEndRef, onReply }: MessageProps) {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (messageId: number) => {
    setOpenDropdownId(openDropdownId === messageId ? null : messageId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };

    if (openDropdownId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);
  return (
    <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4 bg-gray-50">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`flex items-end space-x-2 max-w-[85%] md:max-w-xs lg:max-w-md relative ${
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
              
              {/* Reply Preview in Message */}
              {msg.replyTo && (
                <div className={`mb-2 p-2 rounded-md border-l-3 ${
                  msg.isOwn 
                    ? "bg-blue-600 border-blue-300 text-blue-300" 
                    : "bg-gray-100 border-gray-300 text-gray-600"
                }`}>
                  <p className="text-xs font-medium mb-1">
                    {msg.replyTo.sender}
                  </p>
                  <p className="text-xs truncate">
                    {msg.replyTo.content}
                  </p>
                </div>
              )}
              
              <p className="text-sm break-words whitespace-pre-wrap break-words overflow-wrap break-all">
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
            <div className="flex h-full items-center">
              <EllipsisVertical
                onClick={() => toggleDropdown(msg.id)}
                className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
              />
            </div>
            {openDropdownId === msg.id && (
              <div
                ref={dropdownRef}
                className={`absolute ${
                  msg.isOwn ? "left-0" : "right-0"
                } mt-2 w-32 rounded-md shadow-lg bg-white border-1 focus:outline-none z-50`}
              >
                <div className="py-1">
                  <div
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer flex items-center space-x-2"
                    onClick={() => {
                      // Handle reply functionality
                      onReply?.(msg);
                      setOpenDropdownId(null);
                    }}
                  >
                    <Reply className="w-4 h-4" />
                    <span>Reply</span>
                  </div>
                  <div
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer flex items-center space-x-2"
                    onClick={() => {
                      // Handle pin functionality
                      setOpenDropdownId(null);
                    }}
                  >
                    <Pin className="w-4 h-4" />
                    <span>Pin</span>
                  </div>
                  <div
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer flex items-center space-x-2"
                    onClick={() => {
                      // Handle delete functionality
                      setOpenDropdownId(null);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </div>
                  {msg.isOwn && (
                    <>
                      <div
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer flex items-center space-x-2"
                        onClick={() => {
                          // Handle edit functionality
                          setOpenDropdownId(null);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

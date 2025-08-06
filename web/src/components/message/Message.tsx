import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  EllipsisVertical,
  Reply,
  CheckCheck,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { MessageProps, Message as MessageType } from "@/types/message.types";
import AttachmentDisplay from "./AttachmentDisplay";
import DropdownMenu from "./DropdownMenu";

export default function Message({
  messages,
  messagesEndRef,
  onReply,
  onPin,
  onEdit,
  onDelete,
}: MessageProps) {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (messageId: number) => {
    setOpenDropdownId(openDropdownId === messageId ? null : messageId);
  };

  const closeDropdown = () => {
    setOpenDropdownId(null);
  };

  const handleAction = (action: () => void) => {
    action();
    closeDropdown();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
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
    <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-10 bg-gray-50">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`flex items-end space-x-3 max-w-[85%] md:max-w-sm lg:max-w-md relative ${
              message.isOwn ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            {/* Avatar for other's messages */}
            {!message.isOwn && (
              <Avatar className="w-7 h-7 md:w-8 md:h-8 text-sm font-semibold flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                  {message.avatar}
                </AvatarFallback>
              </Avatar>
            )}

            {/* Message bubble */}
            <div className="relative group">
              <div
                className={`flex items-center space-x-2 mb-1 ${
                  message.isOwn
                    ? "justify-start flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                {/* Message status */}
                {message.isOwn && (
                  <div className="w-5 h-5 flex items-center justify-center text-center text-blue-600">
                    <CheckCheck className="w-4 h-4" />
                  </div>
                )}

                <span className="text-sm font-medium text-gray-900">
                  {message.sender}
                </span>
                {message.role === "teacher" && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-purple-100 text-purple-600"
                  >
                    Teacher
                  </Badge>
                )}
                {message.role === "assistant" && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-green-100 text-green-600"
                  >
                    TA
                  </Badge>
                )}
                {message.role === "admin" && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-red-100 text-red-600"
                  >
                    Admin
                  </Badge>
                )}
                <span className="text-xs text-gray-500">
                  {message.timestamp}
                </span>
              </div>
              <div
                className={`rounded shadow-sm relative ${
                  message.isOwn
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-white text-gray-900 rounded-bl-none border border-gray-100"
                } ${message.isPinned ? "ring-2 ring-yellow-400/50" : ""}`}
              >
                {/* Pin indicator */}
                {message.isPinned && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-yellow-400 text-yellow-900 text-xs px-1.5 py-0.5 rounded-full shadow-sm"></div>
                  </div>
                )}

                {/* Reply Preview */}
                {message.replyTo && (
                  <div
                    className={`mb-2 p-2 rounded-lg border-l-4 ${
                      message.isOwn
                        ? "bg-blue-600/20 border-blue-300 text-blue-100"
                        : "bg-gray-100 border-gray-400 text-gray-600"
                    }`}
                  >
                    <p className="text-xs font-medium mb-1 opacity-90">
                      {message.replyTo.sender}
                    </p>
                    <p className="text-xs truncate max-w-full whitespace-pre-wrap break-words overflow-wrap break-all">
                      {message.replyTo.content}
                    </p>
                  </div>
                )}
                
                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <AttachmentDisplay
                    attachments={message.attachments}
                    isOwn={message.isOwn}
                  />
                )}

                {/* Message content */}
                {message.content && (
                  <p className="text-sm px-4 py-3 leading-relaxed  break-words whitespace-pre-wrap break-words overflow-wrap break-all">
                    {message.content}
                  </p>
                )}
              </div>

              {/* Action button */}
              <div
                className={`absolute top-1/2 transform -translate-y-1/2 ${
                  message.isOwn ? "-left-10" : "-right-10"
                } sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
              >
                <button
                  onClick={() => toggleDropdown(message.id)}
                  className={`p-1.5 rounded-full transition-colors ${
                    message.isOwn
                      ? "hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                      : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <EllipsisVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Reply Button */}
              <div
                className={`flex items-center ${
                  message.isOwn ? "justify-end" : "justify-start"
                } space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReply?.(message)}
                  className="h-6 px-2 text-xs"
                >
                  <Reply className="w-3 h-3 mr-1" />
                  Reply
                </Button>
              </div>

              {/* Dropdown menu */}
              {openDropdownId === message.id && (
                <DropdownMenu
                  message={message}
                  dropdownRef={dropdownRef}
                  onReply={onReply}
                  onPin={onPin}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  handleAction={handleAction}
                />
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

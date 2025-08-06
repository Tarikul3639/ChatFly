"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Reply, CheckCheck, Pin } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { MessageProps } from "@/types/message.types";
import AttachmentDisplay from "./AttachmentDisplay";
import DropdownMenu from "./DropdownMenu";
import ReplyPreview from "./ReplyPreview";

export default function Message({
  messages,
  messagesEndRef,
  onReply,
  onPin,
  onEdit,
  onDelete,
}: MessageProps) {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    number | null
  >(null);
  const [swipedMessageId, setSwipedMessageId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: number]: HTMLDivElement }>({});
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchMoveRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);

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

  // Handle touch start for swipe
  const handleTouchStart = (e: React.TouchEvent, messageId: number) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    touchMoveRef.current = null;
  };

  // Handle touch move for swipe
  const handleTouchMove = (e: React.TouchEvent, messageId: number) => {
    if (!touchStartRef.current) return;
    
    const touch = e.touches[0];
    touchMoveRef.current = { x: touch.clientX, y: touch.clientY };
    
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > 30 && deltaY < 50) {
      // Right swipe (for left-aligned messages) or Left swipe (for right-aligned messages)
      const message = messages.find(m => m.id === messageId);
      if (message) {
        const isValidSwipe = message.isOwn ? deltaX < -30 : deltaX > 30;
        if (isValidSwipe) {
          setSwipedMessageId(messageId);
        } else {
          setSwipedMessageId(null);
        }
      }
    } else {
      setSwipedMessageId(null);
    }
  };

  // Handle mouse start for drag (desktop)
  const handleMouseStart = (e: React.MouseEvent, messageId: number) => {
    isDraggingRef.current = true;
    touchStartRef.current = { x: e.clientX, y: e.clientY };
    touchMoveRef.current = null;
  };

  // Handle mouse move for drag (desktop)
  const handleMouseMove = (e: React.MouseEvent, messageId: number) => {
    if (!isDraggingRef.current || !touchStartRef.current) return;
    
    touchMoveRef.current = { x: e.clientX, y: e.clientY };
    
    const deltaX = e.clientX - touchStartRef.current.x;
    const deltaY = Math.abs(e.clientY - touchStartRef.current.y);
    
    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > 30 && deltaY < 50) {
      const message = messages.find(m => m.id === messageId);
      if (message) {
        const isValidSwipe = message.isOwn ? deltaX < -30 : deltaX > 30;
        if (isValidSwipe) {
          setSwipedMessageId(messageId);
        } else {
          setSwipedMessageId(null);
        }
      }
    } else {
      setSwipedMessageId(null);
    }
  };

  // Handle mouse end for drag (desktop)
  const handleMouseEnd = (e: React.MouseEvent, messageId: number) => {
    if (!isDraggingRef.current || !touchStartRef.current || !touchMoveRef.current) {
      setSwipedMessageId(null);
      isDraggingRef.current = false;
      touchStartRef.current = null;
      touchMoveRef.current = null;
      return;
    }

    const deltaX = touchMoveRef.current.x - touchStartRef.current.x;
    const deltaY = Math.abs(touchMoveRef.current.y - touchStartRef.current.y);
    
    // Trigger reply if swipe is significant enough
    if (Math.abs(deltaX) > 60 && deltaY < 50) {
      const message = messages.find(m => m.id === messageId);
      if (message) {
        const isValidSwipe = message.isOwn ? deltaX < -60 : deltaX > 60;
        if (isValidSwipe) {
          onReply?.(message);
        }
      }
    }

    // Reset swipe state
    setSwipedMessageId(null);
    isDraggingRef.current = false;
    touchStartRef.current = null;
    touchMoveRef.current = null;
  };

  // Handle touch end for swipe
  const handleTouchEnd = (e: React.TouchEvent, messageId: number) => {
    if (!touchStartRef.current || !touchMoveRef.current) {
      setSwipedMessageId(null);
      touchStartRef.current = null;
      touchMoveRef.current = null;
      return;
    }

    const deltaX = touchMoveRef.current.x - touchStartRef.current.x;
    const deltaY = Math.abs(touchMoveRef.current.y - touchStartRef.current.y);
    
    // Trigger reply if swipe is significant enough
    if (Math.abs(deltaX) > 60 && deltaY < 50) {
      const message = messages.find(m => m.id === messageId);
      if (message) {
        const isValidSwipe = message.isOwn ? deltaX < -60 : deltaX > 60;
        if (isValidSwipe) {
          onReply?.(message);
        }
      }
    }

    // Reset swipe state
    setSwipedMessageId(null);
    touchStartRef.current = null;
    touchMoveRef.current = null;
  };

  // Function to scroll to original message
  const scrollToMessage = (messageId: number) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement) {
      messageElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Clear existing timeout
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }

      // Highlight the message temporarily
      setHighlightedMessageId(messageId);
      highlightTimeoutRef.current = setTimeout(() => {
        setHighlightedMessageId(null);
      }, 2000);
    }
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

    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current) {
        setSwipedMessageId(null);
        isDraggingRef.current = false;
        touchStartRef.current = null;
        touchMoveRef.current = null;
      }
    };

    if (openDropdownId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, [openDropdownId]);

  return (
    <div
      className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 bg-gray-50"
      suppressHydrationWarning
    >
      {messages.map((message) => (
        <div
          key={message.id}
          ref={(el) => {
            if (el) messageRefs.current[message.id] = el;
          }}
          className={`flex ${
            message.isOwn ? "justify-end" : "justify-start"
          } transition-all duration-500 ${
            highlightedMessageId === message.id
              ? "bg-gray-200 p-2 rounded-sm"
              : ""
          }`}
          suppressHydrationWarning
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
            <div 
              className="relative group select-none"
              onTouchStart={(e) => handleTouchStart(e, message.id)}
              onTouchMove={(e) => handleTouchMove(e, message.id)}
              onTouchEnd={(e) => handleTouchEnd(e, message.id)}
              onMouseDown={(e) => handleMouseStart(e, message.id)}
              onMouseMove={(e) => handleMouseMove(e, message.id)}
              onMouseUp={(e) => handleMouseEnd(e, message.id)}
              onMouseLeave={() => {
                setSwipedMessageId(null);
                isDraggingRef.current = false;
                touchStartRef.current = null;
                touchMoveRef.current = null;
              }}
              style={{
                transform: swipedMessageId === message.id 
                  ? message.isOwn 
                    ? 'translateX(-30px)' 
                    : 'translateX(30px)'
                  : 'translateX(0)',
                transition: isDraggingRef.current ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                cursor: isDraggingRef.current ? 'grabbing' : 'default'
              }}
            >
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
                  {message.isEdited && (
                    <span className="ml-1 text-gray-400 italic">(edited)</span>
                  )}
                </span>
              </div>
              <div
                className={`rounded shadow-sm relative ${
                  message.isOwn
                    ? "bg-blue-500 text-white rounded-tr-none border border-blue-400"
                    : "bg-white text-gray-900 rounded-bl-none border border-gray-100"
                } ${message.isPinned ? message.isOwn ? "ring-2 ring-yellow-400":"ring-2 ring-yellow-400/50" : ""}`}
              >
                {/* Pin indicator */}
                {message.isPinned && (
                  <div className={`absolute -top-4 ${message.isOwn ? "-left-4 -rotate-40 text-yellow-500" : "-right-4 rotate-40 text-yellow-500" }`}>
                    <div className="text-xs px-1.5 py-0.5 rounded-full">
                      <Pin className="w-3 h-3" />
                    </div>
                  </div>
                )}

                {/* Reply Preview */}
                <ReplyPreview
                  message={message}
                  onScrollToMessage={scrollToMessage}
                />
                
                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <AttachmentDisplay
                    attachments={message.attachments}
                    isOwn={message.isOwn}
                  />
                )}

                {/* Message content */}
                {message.content && (
                  <p className="text-sm px-4 py-2 leading-relaxed  break-words whitespace-pre-wrap break-words overflow-wrap break-all">
                    {message.content}
                  </p>
                )}
              </div>

              {/* Swipe Reply Indicator */}
              {swipedMessageId === message.id && (
                <div
                  className={`absolute top-1/2 transform -translate-y-1/2 ${
                    message.isOwn ? "-right-12" : "-left-12"
                  } text-blue-500 opacity-70 pointer-events-none z-10`}
                >
                  <div className="p-2 bg-blue-100 rounded-full shadow-lg">
                    <Reply className="w-5 h-5" />
                  </div>
                </div>
              )}

              {/* Swipe Hint for first few messages */}
              {messages.indexOf(message) < 3 && !swipedMessageId && (
                <div
                  className={`absolute top-1/2 transform -translate-y-1/2 ${
                    message.isOwn ? "-right-16" : "-left-16"
                  } text-gray-400 opacity-40 pointer-events-none z-10 hidden md:block`}
                >
                  <div className="text-xs whitespace-nowrap">
                    {message.isOwn ? "← Swipe to reply" : "Swipe to reply →"}
                  </div>
                </div>
              )}

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

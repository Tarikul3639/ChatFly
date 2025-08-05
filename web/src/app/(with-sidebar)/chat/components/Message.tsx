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
  isPinned?: boolean;
}

interface MessageProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onReply?: (message: Message) => void;
  onPin?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?: (messageId: number) => void;
}

export default function Message({ 
  messages, 
  messagesEndRef, 
  onReply, 
  onPin, 
  onEdit, 
  onDelete 
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

  // Dropdown Menu Component
  const DropdownMenu = ({ message }: { message: Message }) => (
    <div
      ref={dropdownRef}
      className={`absolute ${
        message.isOwn ? "right-0" : "left-0"
      } mt-2 w-36 rounded-lg shadow-lg bg-white border border-gray-200 focus:outline-none z-50`}
    >
      <div className="py-1">
        <DropdownItem
          icon={<Reply className="w-4 h-4" />}
          label="Reply"
          onClick={() => handleAction(() => onReply?.(message))}
        />
        <DropdownItem
          icon={<Pin className="w-4 h-4" />}
          label={message.isPinned ? "Unpin" : "Pin"}
          onClick={() => handleAction(() => onPin?.(message))}
        />
        {message.isOwn && (
          <>
            <DropdownItem
              icon={<Edit className="w-4 h-4" />}
              label="Edit"
              onClick={() => handleAction(() => onEdit?.(message))}
            />
            <DropdownItem
              icon={<Trash2 className="w-4 h-4" />}
              label="Delete"
              onClick={() => handleAction(() => onDelete?.(message.id))}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            />
          </>
        )}
      </div>
    </div>
  );

  // Dropdown Item Component
  const DropdownItem = ({ 
    icon, 
    label, 
    onClick, 
    className = "text-gray-700 hover:bg-gray-100 hover:text-gray-900" 
  }: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    className?: string;
  }) => (
    <div
      className={`block px-4 py-2 text-sm cursor-pointer flex items-center space-x-2 ${className}`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </div>
  );

  // Reply Preview Component
  const ReplyPreview = ({ replyTo, isOwn }: { replyTo: Message; isOwn: boolean }) => (
    <div className={`mb-2 p-2 rounded-lg border-l-4 ${
      isOwn 
        ? "bg-blue-600/20 border-blue-300 text-blue-100" 
        : "bg-gray-100 border-gray-400 text-gray-600"
    }`}>
      <p className="text-xs font-medium mb-1 opacity-90">
        {replyTo.sender}
      </p>
      <p className="text-xs truncate max-w-full">
        {replyTo.content}
      </p>
    </div>
  );

  // Message Bubble Component
  const MessageBubble = ({ message }: { message: Message }) => (
    <div className="relative group">
      <div
        className={`rounded-2xl px-4 py-3 relative ${
          message.isOwn
            ? "bg-blue-500 text-white rounded-br-sm"
            : "bg-white text-gray-900 rounded-bl-sm shadow-sm border border-gray-100"
        } ${message.isPinned ? "ring-2 ring-yellow-400/50" : ""}`}
      >
        {/* Pin indicator */}
        {message.isPinned && (
          <div className="absolute -top-2 -right-2">
            <div className="bg-yellow-400 text-yellow-900 text-xs px-1.5 py-0.5 rounded-full shadow-sm">
            </div>
          </div>
        )}

        {/* Sender name for other's messages */}
        {!message.isOwn && (
          <p className="text-xs font-medium mb-2 text-gray-500">
            {message.sender}
          </p>
        )}
        
        {/* Reply Preview */}
        {message.replyTo && (
          <ReplyPreview replyTo={message.replyTo} isOwn={message.isOwn} />
        )}
        
        {/* Message content */}
        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
          {message.content}
        </p>
        
        {/* Timestamp */}
        <p className={`text-xs mt-2 ${
          message.isOwn ? "text-blue-100" : "text-gray-500"
        }`}>
          {message.timestamp}
        </p>
      </div>
      
      {/* Action button */}
      <div className={`absolute ${
        message.isOwn 
          ? "-left-10 top-1/2 transform -translate-y-1/2" 
          : "right-2 top-2"
      } sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
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

      {/* Dropdown menu */}
      {openDropdownId === message.id && <DropdownMenu message={message} />}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 bg-gray-50">
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
            <MessageBubble message={message} />
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

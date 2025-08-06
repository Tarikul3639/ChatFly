"use client";

import {
  Reply,
  Pin,
  Edit,
  Trash2,
} from "lucide-react";
import React from "react";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  avatar: string;
  isOwn: boolean;
  replyTo?: Message;
  isPinned?: boolean;
  attachments?: File[];
  role?: string;
}

interface DropdownMenuProps {
  message: Message;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  onReply?: (message: Message) => void;
  onPin?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?: (messageId: number) => void;
  handleAction: (action: () => void) => void;
}

// Dropdown Item Component
const DropdownItem = ({
  icon,
  label,
  onClick,
  className = "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
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

export default function DropdownMenu({
  message,
  dropdownRef,
  onReply,
  onPin,
  onEdit,
  onDelete,
  handleAction,
}: DropdownMenuProps) {
  return (
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
}

"use client";

import { EllipsisVertical, Reply, Pin, Edit, Trash2 } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface ActionButtonProps {
  message: Message;
  onReply?: (message: Message) => void;
  onPin?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?: (messageId: number) => void;
}

export default function ActionButton({
  message,
  onReply,
  onPin,    
  onEdit,
  onDelete,
}: ActionButtonProps) {
  return (
    <div
      className={`absolute top-1/2 transform -translate-y-1/2 ${
        message.isOwn ? "-left-10" : "-right-10"
      } sm:opacity-100 group-hover:opacity-100 transition-opacity duration-200`}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1.5 rounded-full transition-colors hover:bg-gray-200 text-gray-400 hover:text-gray-600 focus:outline-none">
            <EllipsisVertical className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align={message.isOwn ? "end" : "start"} 
          side="bottom"
          className="w-36 rounded-lg"
        >
          <DropdownMenuItem onClick={() => onReply?.(message)}>
            <Reply className="mr-2 h-4 w-4" />
            Reply
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPin?.(message)}>
            <Pin className="mr-2 h-4 w-4" />
            {message.isPinned ? "Unpin" : "Pin"}
          </DropdownMenuItem>
          {message.isOwn && (
            <>
              <DropdownMenuItem onClick={() => onEdit?.(message)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(message.id)}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

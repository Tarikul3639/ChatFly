export interface Message {
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
  isEdited?: boolean;
}

export interface MessageProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onReply?: (message: Message) => void;
  onPin?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?: (messageId: number) => void;
}

export interface AttachmentDisplayProps {
  attachments: File[];
  isOwn: boolean;
}

export interface DropdownMenuProps {
  messageId: number;
  isOpen: boolean;
  onReply?: () => void;
  onPin?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onClose: () => void;
  isOwn: boolean;
}

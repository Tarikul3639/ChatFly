import { User } from './user.types';
import { Message } from './message.types';

export interface Chat {
  id: number;
  name: string;
  type: string;
  avatar: string;
  online: boolean;
  members?: number;
  lastMessage?: Message;
  unreadCount?: number;
  participants?: User[];
}

export interface ChatHeaderProps {
  selectedChat: Chat;
  onBack: () => void;
}

export interface ChatListProps {
  chats: Chat[];
  selectedChatId?: number;
  onChatSelect: (chat: Chat) => void;
}

export interface ChatState {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[];
  loading: boolean;
  error?: string;
}

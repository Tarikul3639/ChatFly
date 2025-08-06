import { useState, useEffect, useRef } from 'react';
import { Chat } from '@/types/chat.types';
import { Message } from '@/types/message.types';

export interface UseChatReturn {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  selectChat: (chat: Chat) => void;
  sendMessage: (content: string, attachments?: File[]) => Promise<void>;
  deleteMessage: (messageId: number) => Promise<void>;
  editMessage: (messageId: number, newContent: string) => Promise<void>;
  pinMessage: (messageId: number) => Promise<void>;
}

export const useChat = (): UseChatReturn => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectChat = (chat: Chat) => {
    setSelectedChat(chat);
    // Load messages for selected chat
    loadMessages(chat.id);
  };

  const loadMessages = async (chatId: number) => {
    setLoading(true);
    try {
      // API call to load messages
      // const response = await fetch(`/api/chats/${chatId}/messages`);
      // const data = await response.json();
      // setMessages(data);
      
      // For now, using mock data
      setMessages([]);
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, attachments?: File[]) => {
    if (!selectedChat) return;
    
    try {
      const newMessage: Message = {
        id: Date.now(),
        sender: 'You',
        content,
        timestamp: new Date().toISOString(),
        avatar: 'YU',
        isOwn: true,
        attachments,
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // API call to send message
      // await fetch(`/api/chats/${selectedChat.id}/messages`, {
      //   method: 'POST',
      //   body: JSON.stringify({ content, attachments }),
      // });
    } catch (err) {
      setError('Failed to send message');
    }
  };

  const deleteMessage = async (messageId: number) => {
    try {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      // API call to delete message
    } catch (err) {
      setError('Failed to delete message');
    }
  };

  const editMessage = async (messageId: number, newContent: string) => {
    try {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, content: newContent } : msg
        )
      );
      // API call to edit message
    } catch (err) {
      setError('Failed to edit message');
    }
  };

  const pinMessage = async (messageId: number) => {
    try {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
        )
      );
      // API call to pin message
    } catch (err) {
      setError('Failed to pin message');
    }
  };

  return {
    chats,
    selectedChat,
    messages,
    loading,
    error,
    selectChat,
    sendMessage,
    deleteMessage,
    editMessage,
    pinMessage,
  };
};

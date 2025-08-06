import { useChat } from '@/hooks/useChat';
import ChatHeader from './ChatHeader';
import { Message } from '@/components/message';
import MessageInput from '@/components/input/Input';
import { useRef, useEffect, useState } from 'react';

export default function Chat() {
  const {
    selectedChat,
    messages,
    loading,
    error,
    sendMessage,
    deleteMessage,
    editMessage,
    pinMessage,
  } = useChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState('');
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleReply = (message: any) => {
    // Handle reply functionality
    console.log('Reply to:', message);
  };

  const handlePin = (message: any) => {
    pinMessage(message.id);
  };

  const handleEdit = (message: any) => {
    // Handle edit - would need additional UI for editing
    console.log('Edit message:', message);
  };

  const handleDelete = (messageId: number) => {
    deleteMessage(messageId);
  };

  const handleSend = async () => {
    if (message.trim() || attachments.length > 0) {
      await sendMessage(message, attachments);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleAISuggestion = (suggestion: string) => {
    setMessage(suggestion);
    setShowAISuggestions(false);
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Select a chat to start messaging
          </h3>
          <p className="text-gray-500">
            Choose from your existing conversations or start a new one
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600 mb-2">Error</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader 
        selectedChat={selectedChat} 
        onBack={() => {}} 
      />
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <Message
          messages={messages}
          messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
          onReply={handleReply}
          onPin={handlePin}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      
      <MessageInput 
        message={message}
        setMessage={setMessage}
        onSend={handleSend}
        showAISuggestions={showAISuggestions}
        setShowAISuggestions={setShowAISuggestions}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        aiSuggestions={[]}
        onAISuggestion={handleAISuggestion}
        textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
        attachments={attachments}
        setAttachments={setAttachments}
      />
    </div>
  );
}

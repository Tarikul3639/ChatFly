import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  avatar: string;
  isOwn: boolean;
}

interface MessageProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export default function Message({ messages, messagesEndRef }: MessageProps) {
  return (
    <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4 bg-gray-50">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`flex items-end space-x-2 max-w-[85%] md:max-w-xs lg:max-w-md ${
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
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
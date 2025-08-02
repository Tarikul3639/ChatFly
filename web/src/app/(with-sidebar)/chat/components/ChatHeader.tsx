import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Phone, Video, MoreHorizontal } from "lucide-react";

interface Chat {
  id: number;
  name: string;
  type: string;
  avatar: string;
  online: boolean;
  members?: number;
}

interface ChatHeaderProps {
  selectedChat: Chat;
  onBack: () => void;
}

export default function ChatHeader({ selectedChat, onBack }: ChatHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Back button for mobile */}
          <Button
            size="icon"
            variant="ghost"
            className="md:hidden"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <Avatar className="w-10 h-10 text-base font-semibold">
            <AvatarFallback
              className={`${
                selectedChat.type === "classroom"
                  ? "bg-blue-100 text-blue-600"
                  : selectedChat.type === "group"
                  ? "bg-green-100 text-green-600"
                  : "bg-purple-100 text-purple-600"
              }`}
            >
              {selectedChat.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
            <div className="flex flex-col md:flex-row text-xs text-gray-500">
              <span className="md:mr-2">
                {selectedChat.members && ` ${selectedChat.members} members`}
              </span>
              <span className="font-medium">
                {selectedChat.online ? (
                  <span className="text-green-500">Active now</span>
                ) : (
                  "Last seen 2h ago"
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="icon" variant="ghost">
            <Phone className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="ghost">
            <Video className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="ghost">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

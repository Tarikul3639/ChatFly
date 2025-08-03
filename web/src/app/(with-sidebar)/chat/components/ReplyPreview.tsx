import { X } from "lucide-react";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  avatar: string;
  isOwn: boolean;
}

interface ReplyPreviewProps {
  replyingTo: Message;
  onCancel: () => void;
}

export default function ReplyPreview({ replyingTo, onCancel }: ReplyPreviewProps) {
  return (
    <div className="bg-gray-50 border-l-4 border-blue-500 px-4 py-3 mx-4 mb-2 rounded-r-md">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <p className="text-xs font-medium text-blue-600">
              Replying to {replyingTo.sender}
            </p>
          </div>
          <p className="text-sm text-gray-600 truncate">
            {replyingTo.content}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="ml-3 flex-shrink-0 p-1 rounded-full hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
}

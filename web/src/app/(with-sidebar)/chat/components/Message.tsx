import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  EllipsisVertical,
  Reply,
  Pin,
  Edit,
  Trash2,
  Image,
  Video,
  Paperclip,
  Download,
  Play,
  CheckCheck,
  LoaderCircle,
  Loader,
  Check,
} from "lucide-react";
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
  attachments?: File[];
  role?: string;
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
  onDelete,
}: MessageProps) {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileExtension = (filename: string): string => {
    const ext = filename.split(".").pop()?.toUpperCase();
    return ext || "FILE";
  };

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

  // Attachment Display Component
  const AttachmentDisplay = ({
    attachments,
    isOwn,
  }: {
    attachments: File[];
    isOwn: boolean;
  }) => {
    const [previewUrls, setPreviewUrls] = useState<{ [key: number]: string }>(
      {}
    );

    useEffect(() => {
      const urls: { [key: number]: string } = {};
      attachments.forEach((file, index) => {
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
          urls[index] = URL.createObjectURL(file);
        }
      });
      setPreviewUrls(urls);

      // Cleanup URLs on unmount
      return () => {
        Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
      };
    }, [attachments]);

    // Separate images, videos, and other files
    const images = attachments
      .filter((file, index) => file.type.startsWith("image/"))
      .map((file, origIndex) => ({ file, index: attachments.indexOf(file) }));
    const videos = attachments
      .filter((file, index) => file.type.startsWith("video/"))
      .map((file, origIndex) => ({ file, index: attachments.indexOf(file) }));
    const otherFiles = attachments
      .filter(
        (file, index) =>
          !file.type.startsWith("image/") && !file.type.startsWith("video/")
      )
      .map((file, origIndex) => ({ file, index: attachments.indexOf(file) }));

    return (
      <div className="mt-2 space-y-2">
        {/* Images Grid */}
        {images.length > 0 && (
          <div
            className={`grid gap-1 max-w-xs ${
              images.length === 1
                ? "grid-cols-1"
                : images.length === 2
                ? "grid-cols-2"
                : images.length === 3
                ? "grid-cols-2"
                : "grid-cols-2"
            }`}
          >
            {images.map(({ file, index }, imgIndex) => (
              <div
                key={index}
                className={`relative rounded-lg overflow-hidden ${
                  images.length === 3 && imgIndex === 0 ? "col-span-2" : ""
                }`}
              >
                <img
                  src={previewUrls[index]}
                  alt={file.name}
                  className={`w-full object-cover cursor-pointer hover:opacity-90 transition-opacity ${
                    images.length === 1 ? "max-h-60" : "h-24"
                  }`}
                  onClick={() => {
                    // Open image in full view
                    const newWindow = window.open();
                    if (newWindow) {
                      newWindow.document.write(`
                        <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #000;">
                          <img src="${previewUrls[index]}" style="max-width: 100%; max-height: 100vh; object-fit: contain;">
                        </div>
                      `);
                    }
                  }}
                />
                {images.length === 1 && (
                  <div
                    className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${
                      isOwn
                        ? "from-blue-900/80 to-transparent"
                        : "from-black/80 to-transparent"
                    } p-2`}
                  >
                    <p className="text-white text-xs font-medium truncate">
                      {file.name}
                    </p>
                    <p className="text-white/80 text-xs">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Videos */}
        {videos.map(({ file, index }) => (
          <div
            key={index}
            className="relative rounded-lg overflow-hidden max-w-xs group"
          >
            <video
              src={previewUrls[index]}
              className="w-full h-auto max-h-60 object-cover rounded-lg"
              controls
              preload="metadata"
              poster={previewUrls[index]}
            >
              Your browser does not support video playback.
            </video>

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </div>

            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${
                isOwn
                  ? "from-blue-900/80 to-transparent"
                  : "from-black/80 to-transparent"
              } p-2 pointer-events-none`}
            >
              <p className="text-white text-xs font-medium truncate">
                {file.name}
              </p>
              <p className="text-white/80 text-xs">
                {formatFileSize(file.size)} • Video
              </p>
            </div>
          </div>
        ))}

        {/* Other Files */}
        {otherFiles.map(({ file, index }) => (
          <div
            key={index}
            className={`p-3 rounded-lg border cursor-pointer hover:bg-opacity-80 transition-all hover:shadow-md max-w-xs ${
              isOwn
                ? "bg-blue-600/20 border-blue-300/50 hover:bg-blue-600/30"
                : "bg-white border-gray-200 hover:bg-gray-50 shadow-sm"
            }`}
            onClick={() => {
              // Create download link
              const url = URL.createObjectURL(file);
              const a = document.createElement("a");
              a.href = url;
              a.download = file.name;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`relative p-2 rounded-lg ${
                  isOwn ? "bg-blue-500/30" : "bg-gray-100"
                }`}
              >
                <Paperclip
                  className={`w-5 h-5 ${
                    isOwn ? "text-blue-200" : "text-gray-600"
                  }`}
                />
                {/* File extension badge */}
                <div
                  className={`absolute -top-1 -right-1 px-1 py-0.5 rounded text-xs font-bold text-white text-[8px] ${
                    isOwn ? "bg-blue-600" : "bg-gray-600"
                  }`}
                >
                  {getFileExtension(file.name)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    isOwn ? "text-blue-100" : "text-gray-900"
                  }`}
                >
                  {file.name}
                </p>
                <div className="flex items-center space-x-1">
                  <p
                    className={`text-xs ${
                      isOwn ? "text-blue-200" : "text-gray-500"
                    }`}
                  >
                    {formatFileSize(file.size)}
                  </p>
                  <span
                    className={`text-xs ${
                      isOwn ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    •
                  </span>
                  <div className="flex items-center space-x-1">
                    <Download
                      className={`w-3 h-3 ${
                        isOwn ? "text-blue-200" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        isOwn ? "text-blue-200" : "text-gray-500"
                      }`}
                    >
                      Download
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-10 bg-gray-50">
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
            <div className="relative group">
              <div
                className={`flex items-center space-x-2 mb-1 ${
                  message.isOwn
                    ? "justify-start flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                {/* Message status */}
                {message.isOwn && (
                  <div className="w-5 h-5 flex items-center justify-center text-center text-blue-600">
                    {/* Message delivered */}
                    {message.isOwn && <CheckCheck className="w-4 h-4" />}
                    {/* Message sending */}
                    {/* {message.isOwn && (
                          <LoaderCircle className="w-4 h-4 animate-spin" />
                        )} */}
                    {/* Message send status */}
                    {/* {message.isOwn && (
                          <Check className="w-4 h-4" />
                        )} */}
                  </div>
                )}

                <span className="text-sm font-medium text-gray-900">
                  {message.sender}
                </span>
                {message.role === "teacher" && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-purple-100 text-purple-600"
                  >
                    Teacher
                  </Badge>
                )}
                {message.role === "assistant" && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-green-100 text-green-600"
                  >
                    TA
                  </Badge>
                )}
                {message.role === "admin" && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-red-100 text-red-600"
                  >
                    Admin
                  </Badge>
                )}
                <span className="text-xs text-gray-500">
                  {message.timestamp}
                </span>
              </div>
              <div
                className={`rounded shadow-sm px-4 py-3 relative ${
                  message.isOwn
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-white text-gray-900 rounded-bl-none border border-gray-100"
                } ${message.isPinned ? "ring-2 ring-yellow-400/50" : ""}`}
              >
                {/* Pin indicator */}
                {message.isPinned && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-yellow-400 text-yellow-900 text-xs px-1.5 py-0.5 rounded-full shadow-sm"></div>
                  </div>
                )}

                {/* Reply Preview */}
                {message.replyTo && (
                  <div
                    className={`mb-2 p-2 rounded-lg border-l-4 ${
                      message.isOwn
                        ? "bg-blue-600/20 border-blue-300 text-blue-100"
                        : "bg-gray-100 border-gray-400 text-gray-600"
                    }`}
                  >
                    <p className="text-xs font-medium mb-1 opacity-90">
                      {message.replyTo.sender}
                    </p>
                    <p className="text-xs truncate max-w-full">
                      {message.replyTo.content}
                    </p>
                  </div>
                )}

                {/* Message content */}
                {message.content && (
                  <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                    {message.content}
                  </p>
                )}

                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <AttachmentDisplay
                    attachments={message.attachments}
                    isOwn={message.isOwn}
                  />
                )}
              </div>

              {/* Action button */}
              <div
                className={`absolute top-1/2 transform -translate-y-1/2 ${
                  message.isOwn ? "-left-10" : "-right-10"
                } sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
              >
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

              {/* Reply Button */}
              <div
                className={`flex items-center ${
                  message.isOwn ? "justify-end" : "justify-start"
                } space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReply?.(message)}
                  className="h-6 px-2 text-xs"
                >
                  <Reply className="w-3 h-3 mr-1" />
                  Reply
                </Button>
              </div>
              {/* Dropdown menu */}
              {openDropdownId === message.id && (
                <DropdownMenu message={message} />
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

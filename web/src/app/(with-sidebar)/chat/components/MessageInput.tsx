"use client";

import { useRef, useState, useEffect } from "react";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Smile,
  Sparkles,
  Mic,
  Send,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  Image,
  Video,
  X,
} from "lucide-react";

interface MessageInputProps {
  message: string;
  setMessage: (v: string) => void;
  onSend: () => void;
  showAISuggestions: boolean;
  setShowAISuggestions: (v: boolean) => void;
  isRecording: boolean;
  setIsRecording: (v: boolean) => void;
  aiSuggestions: string[];
  onAISuggestion: (s: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  attachments?: File[];
  setAttachments?: (files: File[]) => void;
}
export default function MessageInput({
  message,
  setMessage,
  onSend,
  showAISuggestions,
  setShowAISuggestions,
  isRecording,
  setIsRecording,
  aiSuggestions,
  onAISuggestion,
  textareaRef,
  attachments = [],
  setAttachments,
}: MessageInputProps) {
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const aiSuggestionsRef = useRef<HTMLDivElement>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Add voice recording logic here
  };

  const handleFileSelect = (acceptType: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptType;
      fileInputRef.current.click();
    }
    setShowAttachmentMenu(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0 && setAttachments) {
      setAttachments([...attachments, ...files]);
    }
    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    if (setAttachments) {
      const newAttachments = attachments.filter((_, i) => i !== index);
      setAttachments(newAttachments);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  // Handle click outside to close emoji picker
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const node = event.target as Node;

    if (
      emojiRef.current &&
      !emojiRef.current.contains(node)
    ) {
      setEmojiPickerVisible(false);
    }

    if (
      aiSuggestionsRef.current &&
      !aiSuggestionsRef.current.contains(node)
    ) {
      setShowAISuggestions(false);
    }

    if (
      attachmentMenuRef.current &&
      !attachmentMenuRef.current.contains(node)
    ) {
      setShowAttachmentMenu(false);
    }
  };

  // use 'click' (bubble phase) instead of 'mouseup'
  document.addEventListener("mouseup", handleClickOutside);
  return () => {
    document.removeEventListener("mouseup", handleClickOutside);
  };
}, []);


  return (
    <div>
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="max-w-4xl mx-auto px-2 md:px-4 mb-2">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="relative bg-white border border-gray-200 rounded-lg overflow-hidden max-w-xs"
                >
                  {file.type.startsWith('image/') ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-20 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                        <p className="text-white text-xs font-medium truncate">
                          {file.name}
                        </p>
                      </div>
                    </div>
                  ) : file.type.startsWith('video/') ? (
                    <div className="relative">
                      <video
                        src={URL.createObjectURL(file)}
                        className="w-full h-20 object-cover"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/50 rounded-full p-1">
                          <Video className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                        <p className="text-white text-xs font-medium truncate">
                          {file.name}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2 flex items-center space-x-2">
                      <div className="relative">
                        <Paperclip className="w-4 h-4 text-gray-500" />
                        <div className="absolute -top-1 -right-1 px-1 py-0.5 rounded text-xs font-bold text-white bg-gray-600 text-[8px]">
                          {file.name.split('.').pop()?.toUpperCase() || 'FILE'}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => removeAttachment(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        multiple
      />

      <div className="flex items-end space-x-2 max-w-4xl p-2 md:p-4 mx-auto z-50">
        {/* Attachment Button */}
        <div className="relative">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setShowAttachmentMenu(!showAttachmentMenu);
              setEmojiPickerVisible(false);
              setShowAISuggestions(false);
            }}
            className={`text-gray-500 hover:text-gray-700 flex-shrink-0 mb-1 h-9 w-9 transition-all ${
              showAttachmentMenu
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "hover:bg-gray-100"
            }`}
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          {/* Attachment Menu */}
          {showAttachmentMenu && (
            <div
              ref={attachmentMenuRef}
              className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[140px] z-50"
            >
              <button
                onClick={() => handleFileSelect('image/*')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Image className="w-4 h-4 text-blue-500" />
                <span>Image</span>
              </button>
              <button
                onClick={() => handleFileSelect('video/*')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Video className="w-4 h-4 text-purple-500" />
                <span>Video</span>
              </button>
              <button
                onClick={() => handleFileSelect('*/*')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Paperclip className="w-4 h-4 text-gray-500" />
                <span>File</span>
              </button>
            </div>
          )}
        </div>

        {/* Input Container */}
        <div className="flex-1 relative">
          <div className="flex items-end bg-gray-100 hover:bg-gray-200 transition-colors rounded-2xl px-4 py-2 min-h-[44px]">
            <Textarea
              ref={textareaRef}
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={"Type a message..."}
              className="flex-1 bg-transparent border-0 resize-none min-h-[28px] max-h-[120px] text-sm md:text-base placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 leading-6 hide-scrollbar shadow-none break-words overflow-wrap break-all"
              rows={1}
            />

            {/* Right side action buttons */}
            <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
              {/* Emoji Button */}
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  setShowAISuggestions(false);
                  setShowAttachmentMenu(false);
                  setEmojiPickerVisible(!emojiPickerVisible);
                }}
                className={`h-8 w-8 rounded-full transition-all ${
                  emojiPickerVisible
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <Smile className="w-4 h-4" />
              </Button>

              {/* AI Suggestions Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  setEmojiPickerVisible(false);
                  setShowAttachmentMenu(false);
                  setShowAISuggestions(!showAISuggestions);
                }}
                className={`h-8 px-2 rounded-full transition-all ${
                  showAISuggestions
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <Sparkles className="w-4 h-4" />
              </Button>

              {/* Voice Record Button (shows when no text) */}
              {!message.trim() && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleVoiceRecord}
                  className={`h-8 w-8 rounded-full transition-all ${
                    isRecording
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Send Button */}
        <Button
          size="icon"
          className={`rounded-full flex-shrink-0 h-11 w-11 transition-all duration-200 ${
            message.trim() || attachments.length > 0
              ? "bg-blue-500 hover:bg-blue-600 scale-100 shadow-lg"
              : "bg-gray-300 cursor-not-allowed scale-95"
          }`}
          disabled={!message.trim() && attachments.length === 0}
          onClick={onSend}
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      {/* Character count indicator */}
      {message.length > 500 && (
        <div className="text-xs text-gray-400 text-right mt-2 px-2">
          {message.length}/1000
        </div>
      )}

      {/* Emoji Picker */}
      {emojiPickerVisible && (
        <div ref={emojiRef}>
          <EmojiPicker
            onEmojiClick={(emoji: { emoji: string }) =>
              setMessage(message + emoji.emoji)
            }
            style={{ width: "100%", border: "none" }}
            height={400}
            emojiStyle={EmojiStyle.FACEBOOK}
            lazyLoadEmojis={true}
            allowExpandReactions={true}
            skinTonesDisabled={true}
            autoFocusSearch={false}
          />
        </div>
      )}

      {/* AI Suggestions Bar */}
      {showAISuggestions && (
        <div
          ref={aiSuggestionsRef}
          className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              AI Suggestions
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.length > 0 ? (
              aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onAISuggestion(suggestion)}
                  className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors flex flex-center space-x-2"
                >
                  <span className="text-left">{suggestion}</span>
                  <div className="flex space-x-1">
                    <ThumbsUp className="w-3 h-3 text-gray-400 hover:text-green-500 cursor-pointer" />
                    <ThumbsDown className="w-3 h-3 text-gray-400 hover:text-red-500 cursor-pointer" />
                  </div>
                </button>
              ))
            ) : (
              <div className="text-gray-500 text-sm">
                No AI suggestions available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

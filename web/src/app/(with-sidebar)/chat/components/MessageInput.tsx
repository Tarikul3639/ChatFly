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
} from "lucide-react";
import AttachmentPreview from "./AttachmentPreview";

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
  const [activeInputType, setActiveInputType] = useState<'none' | 'image' | 'video' | 'file' | 'voice'>('none');
  const emojiRef = useRef<HTMLDivElement>(null);
  const aiSuggestionsRef = useRef<HTMLDivElement>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleVoiceRecord = () => {
    if (activeInputType === 'none' || activeInputType === 'voice') {
      setActiveInputType(isRecording ? 'none' : 'voice');
      setIsRecording(!isRecording);
      // Close other inputs
      setEmojiPickerVisible(false);
      setShowAISuggestions(false);
      setShowAttachmentMenu(false);
    }
    // Add voice recording logic here
  };

  const handleFileSelect = (acceptType: string) => {
    let inputType: 'image' | 'video' | 'file' = 'file';
    
    if (acceptType === 'image/*') inputType = 'image';
    else if (acceptType === 'video/*') inputType = 'video';
    else inputType = 'file';

    if (activeInputType === 'none' || activeInputType === inputType) {
      setActiveInputType(inputType);
      
      if (fileInputRef.current) {
        fileInputRef.current.accept = acceptType;
        fileInputRef.current.click();
      }
      setShowAttachmentMenu(false);
      
      // Close other inputs
      setEmojiPickerVisible(false);
      setShowAISuggestions(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0 && setAttachments) {
      // Filter files based on active input type
      let filteredFiles = files;
      
      if (activeInputType === 'image') {
        filteredFiles = files.filter(file => file.type.startsWith('image/'));
      } else if (activeInputType === 'video') {
        filteredFiles = files.filter(file => file.type.startsWith('video/'));
      } else if (activeInputType === 'file') {
        filteredFiles = files.filter(file => 
          !file.type.startsWith('image/') && !file.type.startsWith('video/')
        );
      }
      
      setAttachments([...attachments, ...filteredFiles]);
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
      
      // Reset active input type if no attachments left
      if (newAttachments.length === 0) {
        setActiveInputType('none');
      }
    }
  };

  // Check current attachment types to maintain active input type
  useEffect(() => {
    if (attachments.length > 0) {
      const hasImages = attachments.some(file => file.type.startsWith('image/'));
      const hasVideos = attachments.some(file => file.type.startsWith('video/'));
      const hasFiles = attachments.some(file => 
        !file.type.startsWith('image/') && !file.type.startsWith('video/')
      );
      
      if (hasImages && !hasVideos && !hasFiles) {
        setActiveInputType('image');
      } else if (hasVideos && !hasImages && !hasFiles) {
        setActiveInputType('video');
      } else if (hasFiles && !hasImages && !hasVideos) {
        setActiveInputType('file');
      }
    } else if (!isRecording) {
      setActiveInputType('none');
    }
  }, [attachments, isRecording]);

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
      <AttachmentPreview
        attachments={attachments}
        onRemoveAttachment={removeAttachment}
        setAttachments={setAttachments}
      />

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
              if (activeInputType === 'none' || activeInputType === 'image' || activeInputType === 'video' || activeInputType === 'file') {
                setShowAttachmentMenu(!showAttachmentMenu);
                setEmojiPickerVisible(false);
                setShowAISuggestions(false);
              }
            }}
            disabled={activeInputType === 'voice'}
            className={`text-gray-500 hover:text-gray-700 flex-shrink-0 mb-1 h-9 w-9 transition-all ${
              showAttachmentMenu
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : activeInputType === 'voice'
                ? "opacity-50 cursor-not-allowed"
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
                disabled={activeInputType !== 'none' && activeInputType !== 'image'}
                className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 ${
                  activeInputType !== 'none' && activeInputType !== 'image'
                    ? "text-gray-400 cursor-not-allowed opacity-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Image className={`w-4 h-4 ${activeInputType === 'image' ? 'text-blue-600' : 'text-blue-500'}`} />
                <span>Image</span>
                {activeInputType === 'image' && <span className="ml-auto text-xs text-blue-600">Active</span>}
              </button>
              <button
                onClick={() => handleFileSelect('video/*')}
                disabled={activeInputType !== 'none' && activeInputType !== 'video'}
                className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 ${
                  activeInputType !== 'none' && activeInputType !== 'video'
                    ? "text-gray-400 cursor-not-allowed opacity-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Video className={`w-4 h-4 ${activeInputType === 'video' ? 'text-purple-600' : 'text-purple-500'}`} />
                <span>Video</span>
                {activeInputType === 'video' && <span className="ml-auto text-xs text-purple-600">Active</span>}
              </button>
              <button
                onClick={() => handleFileSelect('*/*')}
                disabled={activeInputType !== 'none' && activeInputType !== 'file'}
                className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 ${
                  activeInputType !== 'none' && activeInputType !== 'file'
                    ? "text-gray-400 cursor-not-allowed opacity-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Paperclip className={`w-4 h-4 ${activeInputType === 'file' ? 'text-gray-600' : 'text-gray-500'}`} />
                <span>File</span>
                {activeInputType === 'file' && <span className="ml-auto text-xs text-gray-600">Active</span>}
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
                  disabled={activeInputType !== 'none' && activeInputType !== 'voice'}
                  className={`h-8 w-8 rounded-full transition-all ${
                    isRecording
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : activeInputType !== 'none' && activeInputType !== 'voice'
                      ? "text-gray-400 cursor-not-allowed opacity-50"
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

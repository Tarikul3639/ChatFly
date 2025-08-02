"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Smile, Sparkles, Mic, Send, Paperclip } from "lucide-react";

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
}: MessageInputProps) {

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Add voice recording logic here
  };

  return (
    <div>
      <div className="flex items-end space-x-2 max-w-4xl p-2 md:p-4 mx-auto z-50">
        {/* Attachment Button */}
        <Button
          size="icon"
          variant="ghost"
          className="text-gray-500 hover:text-gray-700 flex-shrink-0 mb-1 h-9 w-9"
        >
          <Paperclip className="w-5 h-5" />
        </Button>

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
                className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-300 rounded-full"
              >
                <Smile className="w-4 h-4" />
              </Button>

              {/* AI Suggestions Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAISuggestions(!showAISuggestions)}
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
            message.trim()
              ? "bg-blue-500 hover:bg-blue-600 scale-100 shadow-lg"
              : "bg-gray-300 cursor-not-allowed scale-95"
          }`}
          disabled={!message.trim()}
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

      {/* AI Suggestions Bar */}
      {showAISuggestions && (
        <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              AI Suggestions
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onAISuggestion(suggestion)}
                className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center space-x-2"
              >
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
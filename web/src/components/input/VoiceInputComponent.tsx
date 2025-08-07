"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Play, Pause, Trash2 } from "lucide-react";

interface VoiceInputComponentProps {
  isRecording: boolean;
  setIsRecording: (v: boolean) => void;
  onVoiceComplete: (transcription: string) => void;
  disabled?: boolean;
}

export default function VoiceInputComponent({
  isRecording,
  setIsRecording,
  onVoiceComplete,
  disabled = false,
}: VoiceInputComponentProps) {
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioWaves, setAudioWaves] = useState<number[]>([]);
  const [showVoiceUI, setShowVoiceUI] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Simulate audio waves animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      setShowVoiceUI(true);
      interval = setInterval(() => {
        setAudioWaves(
          Array.from({ length: 20 }, () => Math.random() * 100 + 10)
        );
        setRecordingDuration((prev) => prev + 1);
      }, 100);
    } else if (isPaused) {
      setAudioWaves(Array.from({ length: 20 }, () => 20)); // Static waves when paused
    } else {
      setAudioWaves([]);
      setRecordingDuration(0);
      setIsPaused(false);
      // Delay hiding the UI for smooth animation
      if (showVoiceUI) {
        setTimeout(() => setShowVoiceUI(false), 300);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, isPaused, showVoiceUI]);

  const handleStartRecording = () => {
    if (!disabled) {
      setIsRecording(true);
      // Add actual voice recording logic here
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Add logic to process the recording and call onVoiceComplete
    // For now, we'll simulate with a placeholder
    setTimeout(() => {
      onVoiceComplete("Voice recording transcription placeholder");
    }, 500);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    // Add actual pause/resume logic here
  };

  const handleDeleteRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    // Delete the current recording
  };

  const formatDuration = (duration: number) => {
    const seconds = Math.floor(duration / 10);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Voice input trigger button (when not recording)
  if (!isRecording && !showVoiceUI) {
    return (
      <Button
        size="icon"
        variant="ghost"
        onClick={handleStartRecording}
        disabled={disabled}
        className={`h-8 w-8 rounded-full transition-all ${
          disabled
            ? "text-gray-400 cursor-not-allowed opacity-50"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-300"
        }`}
      >
        <Mic className="w-4 h-4" />
      </Button>
    );
  }
  
  // Voice recording UI (when recording or showing UI)
  if (showVoiceUI) {
    return (
      <div className="flex items-center space-x-2">
        {isRecording ? (
          <>
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                {audioWaves.map((wave, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded ${isPaused ? 'bg-yellow-500' : 'bg-blue-500'}`}
                    style={{ width: `${wave}%` }}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {formatDuration(recordingDuration)}
              </span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePauseResume}
              className={`h-8 w-8 rounded-full ${isPaused ? 'text-yellow-500 hover:text-yellow-700' : 'text-blue-500 hover:text-blue-700'}`}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleStopRecording}
              className="h-8 w-8 rounded-full text-green-500 hover:text-green-700"
            >
              <MicOff className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDeleteRecording}
              className="h-8 w-8 rounded-full text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        ) : (
          // Transitioning state - show basic button
          <Button
            size="icon"
            variant="ghost"
            onClick={handleStartRecording}
            disabled={disabled}
            className={`h-8 w-8 rounded-full transition-all ${
              disabled
                ? "text-gray-400 cursor-not-allowed opacity-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-300"
            }`}
          >
            <Mic className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }

  // Default fallback
  return null;
}

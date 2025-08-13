"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, X, Play, Pause, Check } from "lucide-react";

interface VoiceInputComponentProps {
  isRecording: boolean;
  setIsRecording: (v: boolean) => void;
  voice: Blob | null;
  setVoice: (v: Blob | null) => void;
  disabled?: boolean;
}

export default function ModernVoiceInputComponent({
  isRecording,
  setIsRecording,
  voice,
  setVoice,
  disabled = false,
}: VoiceInputComponentProps) {
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // 🎙 Start Recording
  const handleMicClick = async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Voice recording is not supported in this browser");
        return;
      }

      // Request microphone permission with mobile-friendly constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          // Mobile-friendly settings
          sampleRate: 44100,
          channelCount: 1
        } 
      });
      
      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        alert("Audio recording is not supported in this browser");
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setVoice(blob); // ✅ Save merged Blob
        chunksRef.current = [];
        stream.getTracks().forEach((track) => track.stop());
        // Stop recording state
        setIsRecording(false);
        setIsPaused(false);
        setTime(0);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setTime(0);
    } catch (error) {
      console.error("Microphone access error:", error);
      
      // Better error messages for different scenarios
      const err = error as any;
      if (err.name === 'NotAllowedError') {
        alert("Microphone permission denied. Please allow microphone access and try again.");
      } else if (err.name === 'NotFoundError') {
        alert("No microphone found. Please connect a microphone and try again.");
      } else if (err.name === 'NotSupportedError') {
        alert("Audio recording is not supported in this browser.");
      } else {
        alert("Failed to access microphone. Please check your settings and try again.");
      }
    }
  };

  // ❌ Cancel Recording
  const handleCancel = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
    setTime(0);
    setVoice(null);
  };

  // ⏸ Pause Recording
  const handlePause = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause(); // ✅ Stop taking input temporarily
      setIsPaused(true);
    }
  };

  // ▶ Resume Recording
  const handleResume = () => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume(); // ✅ Continue adding to same Blob
      setIsPaused(false);
    }
  };

  // ✅ Stop and Save Recording
  const handleDone = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // This will trigger onstop and save the blob
    }
  };

  // Time counter
  useEffect(() => {
    if (isRecording && !isPaused) {
      const interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRecording, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {isRecording ? (
        <div
          ref={containerRef}
          className="flex items-center bg-white dark:bg-slate-800 rounded-full px-4 py-2 shadow-lg border border-slate-200 dark:border-slate-700"
        >
          {/* Cancel Button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCancel}
            className="h-8 w-8 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Recording Waveform Animation */}
          <div className="flex items-center gap-1 mx-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-blue-500 rounded-full animate-pulse"
                style={{
                  height: `${8 + Math.sin(Date.now() / 200 + i) * 4}px`,
                  animationDelay: `${i * 100}ms`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>

          {/* Time Display */}
          <div className="flex-1 text-center">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {formatTime(time)}
            </span>
          </div>

          {/* Pause and Resume */}
          <Button
            size="icon"
            variant="ghost"
            onClick={isPaused ? handleResume : handlePause}
            className="h-8 w-8 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {isPaused ? (
              <Play className="w-4 h-4" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
          </Button>

          {/* Done Button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDone}
            className="h-8 w-8 rounded-full text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-200 hover:bg-green-100 dark:hover:bg-green-700"
          >
            <Check className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Button
          size="icon"
          variant="ghost"
          onClick={handleMicClick}
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

import { Maximize2 } from "lucide-react";
import React, { useState, useRef } from "react";
const ReactPlayer = require('react-player').default;

interface VideoAttachmentProps {
  videos: { file: File; index: number }[];
  previewUrls: { [key: number]: string };
  isOwn: boolean;
  formatFileSize: (bytes: number) => string;
}

export default function VideoAttachment({
  videos,
  previewUrls,
  isOwn,
  formatFileSize,
}: VideoAttachmentProps) {
  const [duration, setDuration] = useState<{ [key: number]: number }>({});
  const [isPlaying, setIsPlaying] = useState<{ [key: number]: boolean }>({});
  const playerRefs = useRef<{ [key: number]: any }>({});

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {videos.map(({ file, index }) => (
        <div
          key={index}
          className="relative rounded-lg overflow-hidden max-w-sm group bg-gray-900"
        >
          {/* React Player */}
          <div className="relative">
            {/* @ts-ignore */}
            <ReactPlayer
              ref={(el: any) => {
                playerRefs.current[index] = el;
              }}
              src={previewUrls[index]}
              width="100%"
              controls={true}
              onPlay={() => setIsPlaying(prev => ({ ...prev, [index]: true }))}
              onPause={() => setIsPlaying(prev => ({ ...prev, [index]: false }))}
              onEnded={() => setIsPlaying(prev => ({ ...prev, [index]: false }))}
              onDuration={(duration: number) => setDuration(prev => ({ ...prev, [index]: duration }))}
              style={{
                borderRadius: '8px',
              }}
            />
          </div>

          {/* Video info overlay */}
          <div
            className={`absolute top-0 left-0 right-0 bg-gradient-to-t ${
              isOwn
                ? "from-transparent to-blue-900/80"
                : "from-transparent to-black/80"
            } p-3 transition-opacity duration-300 ${
              isPlaying[index] ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="flex items-center justify-between">
              {/* Video info */}
              <div className="flex-1">
                <p className="text-white text-xs font-medium truncate">
                  {file.name}
                </p>
                <p className="text-white/80 text-xs">
                  {formatFileSize(file.size)} • Video
                  {duration[index] && ` • ${formatDuration(duration[index])}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

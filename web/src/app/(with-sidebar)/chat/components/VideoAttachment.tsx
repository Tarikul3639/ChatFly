import { Play, Pause } from "lucide-react";
import React, { useState, useRef } from "react";

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
  const [isPlaying, setIsPlaying] = useState<{ [key: number]: boolean }>({});
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  const togglePlayPause = (videoIndex: number, event: React.MouseEvent) => {
    event.preventDefault();
    const video = videoRefs.current[videoIndex];
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(prev => ({ ...prev, [videoIndex]: true }));
      } else {
        video.pause();
        setIsPlaying(prev => ({ ...prev, [videoIndex]: false }));
      }
    }
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      {videos.map(({ file, index }) => (
        <div
          key={index}
          className="relative rounded-lg overflow-hidden max-w-sm group bg-black/5"
        >
          <video
            ref={(el) => {
              videoRefs.current[index] = el;
            }}
            src={previewUrls[index]}
            className="w-full h-auto max-h-60 object-cover rounded-lg"
            preload="metadata"
            poster={previewUrls[index]}
            onPlay={() => setIsPlaying(prev => ({ ...prev, [index]: true }))}
            onPause={() => setIsPlaying(prev => ({ ...prev, [index]: false }))}
          >
            Your browser does not support video playback.
          </video>

          {/* Play/Pause button overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={(e) => togglePlayPause(index, e)}
          >
            {!isPlaying[index] && (
              <div className="bg-black/50 rounded-full p-4 backdrop-blur-sm hover:bg-black/60 transition-all duration-200 transform hover:scale-110">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            )}
          </div>

          {/* Video controls overlay */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${
              isOwn
                ? "from-blue-900/80 to-transparent"
                : "from-black/80 to-transparent"
            } p-3`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-white text-xs font-medium truncate">
                  {file.name}
                </p>
                <p className="text-white/80 text-xs">
                  {formatFileSize(file.size)} • Video
                </p>
              </div>
              
              {/* Duration display */}
              <div className="ml-2">
                <video
                  src={previewUrls[index]}
                  preload="metadata"
                  className="hidden"
                  onLoadedMetadata={(e) => {
                    const duration = (e.target as HTMLVideoElement).duration;
                    if (!isNaN(duration)) {
                      const durationElement = document.getElementById(`duration-${index}`);
                      if (durationElement) {
                        durationElement.textContent = formatDuration(duration);
                      }
                    }
                  }}
                />
                <span
                  id={`duration-${index}`}
                  className="text-white/80 text-xs font-mono bg-black/30 px-2 py-1 rounded"
                >
                  0:00
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
            <div
              className={`h-full ${
                isOwn ? "bg-blue-400" : "bg-green-400"
              } transition-all duration-100`}
              style={{
                width: videoRefs.current[index]
                  ? `${
                      (videoRefs.current[index]!.currentTime /
                        videoRefs.current[index]!.duration) *
                      100
                    }%`
                  : "0%",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

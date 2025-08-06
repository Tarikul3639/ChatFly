"use client";

import React, { useState, useEffect } from "react";
import ImageAttachment from "./ImageAttachment";
import VideoAttachment from "./VideoAttachment";
import FileAttachment from "./FileAttachment";
import ClientOnly from "@/components/ui/ClientOnly";

interface AttachmentDisplayProps {
  attachments: File[];
  isOwn: boolean;
}

export default function AttachmentDisplay({
  attachments,
  isOwn,
}: AttachmentDisplayProps) {
  const [previewUrls, setPreviewUrls] = useState<{ [key: number]: string }>({});

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

  useEffect(() => {
    const urls: { [key: number]: string } = {};
    attachments.forEach((file, index) => {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        try {
          urls[index] = URL.createObjectURL(file);
        } catch (error) {
          console.warn('Failed to create object URL for file:', file.name, error);
        }
      }
    });
    setPreviewUrls(urls);

    // Cleanup URLs on unmount
    return () => {
      Object.values(urls).forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (error) {
          console.warn('Failed to revoke object URL:', error);
        }
      });
    };
  }, [attachments]);

  // Separate images, videos, and other files
  const images = attachments
    .filter((file) => file.type.startsWith("image/"))
    .map((file) => ({ file, index: attachments.indexOf(file) }));
  const videos = attachments
    .filter((file) => file.type.startsWith("video/"))
    .map((file) => ({ file, index: attachments.indexOf(file) }));
  const otherFiles = attachments
    .filter(
      (file) =>
        !file.type.startsWith("image/") && !file.type.startsWith("video/")
    )
    .map((file) => ({ file, index: attachments.indexOf(file) }));

  return (
    <ClientOnly fallback={
      <div className="mt-2 p-1 space-y-1">
        <div className="animate-pulse bg-gray-200 h-20 w-full rounded"></div>
      </div>
    }>
      <div className="mt-2 p-1 space-y-1">
        {/* Images */}
        <ImageAttachment
          images={images}
          previewUrls={previewUrls}
          isOwn={isOwn}
          formatFileSize={formatFileSize}
        />

        {/* Videos */}
        <VideoAttachment
          videos={videos}
          previewUrls={previewUrls}
          isOwn={isOwn}
          formatFileSize={formatFileSize}
        />

        {/* Other Files */}
        <FileAttachment
          otherFiles={otherFiles}
          isOwn={isOwn}
          formatFileSize={formatFileSize}
          getFileExtension={getFileExtension}
        />
      </div>
    </ClientOnly>
  );
}

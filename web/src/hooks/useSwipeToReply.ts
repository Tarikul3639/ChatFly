import { useRef } from 'react';
import { Message } from '@/types/message.types';

interface SwipeHandlers {
  handleTouchStart: (e: React.TouchEvent, messageId: number) => void;
  handleTouchMove: (e: React.TouchEvent, messageId: number) => void;
  handleTouchEnd: (e: React.TouchEvent, messageId: number) => void;
  resetSwipeState: () => void;
}

interface UseSwipeToReplyProps {
  messages: Message[];
  onReply?: (message: Message) => void;
  setSwipedMessageId: (id: number | null) => void;
  setDragOffset: (offset: number) => void;
}

export const useSwipeToReply = ({
  messages,
  onReply,
  setSwipedMessageId,
  setDragOffset,
}: UseSwipeToReplyProps): SwipeHandlers => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchMoveRef = useRef<{ x: number; y: number } | null>(null);

  // Handle touch start for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    touchMoveRef.current = null;
  };

  // Handle touch move for swipe
  const handleTouchMove = (e: React.TouchEvent, messageId: number) => {
    if (!touchStartRef.current) return;
    
    const touch = e.touches[0];
    touchMoveRef.current = { x: touch.clientX, y: touch.clientY };
    
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > 10 && deltaY < 50) {
      const message = messages.find(m => m.id === messageId);
      if (message) {
        const isValidDirection = message.isOwn ? deltaX < 0 : deltaX > 0;
        if (isValidDirection) {
          // Amplify the drag distance with a multiplier and add some resistance
          const amplifiedDelta = deltaX * 1; // 1x amplification
          const maxDrag = 60; // Maximum drag distance
          const resistanceFactor = Math.abs(amplifiedDelta) / maxDrag;
          const finalOffset = amplifiedDelta * (1 - resistanceFactor * 0.1); // Add resistance

          setDragOffset(finalOffset);
          setSwipedMessageId(messageId);
        } else {
          setDragOffset(0);
          setSwipedMessageId(null);
        }
      }
    } else if (Math.abs(deltaX) <= 10) {
      setDragOffset(0);
      setSwipedMessageId(null);
    }
  };

  // Handle touch end for swipe
  const handleTouchEnd = (e: React.TouchEvent, messageId: number) => {
    if (!touchStartRef.current || !touchMoveRef.current) {
      setSwipedMessageId(null);
      setDragOffset(0);
      touchStartRef.current = null;
      touchMoveRef.current = null;
      return;
    }

    const deltaX = touchMoveRef.current.x - touchStartRef.current.x;
    const deltaY = Math.abs(touchMoveRef.current.y - touchStartRef.current.y);
    
    // Trigger reply if swipe is significant enough
    if (Math.abs(deltaX) > 40 && deltaY < 50) {
      const message = messages.find(m => m.id === messageId);
      if (message) {
        const isValidSwipe = message.isOwn ? deltaX < -40 : deltaX > 40;
        if (isValidSwipe) {
          // Haptic feedback for mobile devices
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
          onReply?.(message);
        }
      }
    }

    // Reset swipe state
    setSwipedMessageId(null);
    setDragOffset(0);
    touchStartRef.current = null;
    touchMoveRef.current = null;
  };

  const resetSwipeState = () => {
    setSwipedMessageId(null);
    setDragOffset(0);
    touchStartRef.current = null;
    touchMoveRef.current = null;
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    resetSwipeState,
  };
};

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
  setHoldMessageId: (id: number | null) => void;
}

export const useSwipeToReply = ({
  messages,
  onReply,
  setSwipedMessageId,
  setHoldMessageId,
  setDragOffset,
}: UseSwipeToReplyProps): SwipeHandlers => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchMoveRef = useRef<{ x: number; y: number } | null>(null);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasMovedRef = useRef<boolean>(false);

  // Handle touch start for swipe
  const handleTouchStart = (e: React.TouchEvent, messageId: number) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    touchMoveRef.current = null;
    hasMovedRef.current = false;
    
    // Clear any existing hold timeout
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
    }
    
    // Start hold timer - trigger after 500ms if no significant movement
    holdTimeoutRef.current = setTimeout(() => {
      if (!hasMovedRef.current && touchStartRef.current) {
        setHoldMessageId(messageId);
      }
    }, 200);
  };

  // Handle touch move for swipe
  const handleTouchMove = (e: React.TouchEvent, messageId: number) => {
    if (!touchStartRef.current) return;
    
    const touch = e.touches[0];
    touchMoveRef.current = { x: touch.clientX, y: touch.clientY };
    
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

    // Check if user has moved significantly (cancels hold)
    if (Math.abs(deltaX) > 5 || deltaY > 5) {
      hasMovedRef.current = true;
      // Clear hold timeout if user starts moving
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = null;
      }
      // Clear any existing hold state
      setHoldMessageId(null);
    }
    
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
    // Clear hold timeout
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }

    if (!touchStartRef.current || !touchMoveRef.current) {
      setSwipedMessageId(null);
      setDragOffset(0);
      touchStartRef.current = null;
      touchMoveRef.current = null;
      hasMovedRef.current = false;
      return;
    }

    const deltaX = touchMoveRef.current.x - touchStartRef.current.x;
    
    // Trigger reply if swipe is significant enough
    if (Math.abs(deltaX) > 80) {
      const message = messages.find(m => m.id === messageId);
      if (message) {
        const isValidSwipe = message.isOwn ? deltaX < -80 : deltaX > 80;
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
    hasMovedRef.current = false;
  };

  const resetSwipeState = () => {
    // Clear hold timeout
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    
    setSwipedMessageId(null);
    setDragOffset(0);
    setHoldMessageId(null);
    touchStartRef.current = null;
    touchMoveRef.current = null;
    hasMovedRef.current = false;
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    resetSwipeState,
  };
};

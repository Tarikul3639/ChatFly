import { io, Socket } from 'socket.io-client';

class SocketManager {
  private socket: Socket | null = null;
  private static instance: SocketManager;

  private constructor() {}

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  connect(serverUrl: string = 'http://localhost:5000'): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      forceNew: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    this.setupEventListeners();
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Chat Methods
  joinRoom(roomId: string): void {
    this.socket?.emit('join-room', roomId);
  }

  leaveRoom(roomId: string): void {
    this.socket?.emit('leave-room', roomId);
  }

  sendMessage(data: {
    roomId: string;
    message: string;
    username: string;
    timestamp?: string;
  }): void {
    this.socket?.emit('send-message', {
      ...data,
      timestamp: data.timestamp || new Date().toISOString(),
    });
  }

  // Typing Indicators
  startTyping(roomId: string, username: string): void {
    this.socket?.emit('typing-start', { roomId, username });
  }

  stopTyping(roomId: string, username: string): void {
    this.socket?.emit('typing-stop', { roomId, username });
  }

  // Video Call Methods
  requestVideoCall(roomId: string, fromUser: string, toUser: string): void {
    this.socket?.emit('video-call-request', { roomId, fromUser, toUser });
  }

  answerVideoCall(callId: string, accepted: boolean, sdp?: any): void {
    this.socket?.emit('video-call-answer', { callId, accepted, sdp });
  }

  endVideoCall(roomId: string): void {
    this.socket?.emit('video-call-end', { roomId });
  }

  // WebRTC Signaling
  sendOffer(roomId: string, offer: any): void {
    this.socket?.emit('webrtc-offer', { roomId, offer });
  }

  sendAnswer(roomId: string, answer: any): void {
    this.socket?.emit('webrtc-answer', { roomId, answer });
  }

  sendIceCandidate(roomId: string, candidate: any): void {
    this.socket?.emit('webrtc-ice-candidate', { roomId, candidate });
  }

  // Event Listeners Setup
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('🟢 Connected to ChatFly server:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('🔴 Disconnected from server:', reason);
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('❌ Connection error:', error);
    });

    this.socket.on('reconnect', (attemptNumber: number) => {
      console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
    });

    this.socket.on('reconnect_error', (error: Error) => {
      console.error('🔄❌ Reconnection failed:', error);
    });
  }

  // Event Listener Helpers
  onMessage(callback: (data: any) => void): void {
    this.socket?.on('receive-message', callback);
  }

  onUserJoined(callback: (data: any) => void): void {
    this.socket?.on('user-joined', callback);
  }

  onUserLeft(callback: (data: any) => void): void {
    this.socket?.on('user-left', callback);
  }

  onTyping(callback: (data: any) => void): void {
    this.socket?.on('user-typing', callback);
  }

  onVideoCallRequest(callback: (data: any) => void): void {
    this.socket?.on('incoming-video-call', callback);
  }

  onVideoCallAnswered(callback: (data: any) => void): void {
    this.socket?.on('video-call-answered', callback);
  }

  onVideoCallEnded(callback: () => void): void {
    this.socket?.on('video-call-ended', callback);
  }

  onWebRTCOffer(callback: (data: any) => void): void {
    this.socket?.on('webrtc-offer', callback);
  }

  onWebRTCAnswer(callback: (data: any) => void): void {
    this.socket?.on('webrtc-answer', callback);
  }

  onWebRTCIceCandidate(callback: (data: any) => void): void {
    this.socket?.on('webrtc-ice-candidate', callback);
  }

  // Remove Event Listeners
  removeAllListeners(): void {
    this.socket?.removeAllListeners();
  }

  removeListener(event: string): void {
    this.socket?.off(event);
  }
}

export default SocketManager;

// Export singleton instance
export const socketManager = SocketManager.getInstance();

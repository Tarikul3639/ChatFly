'use client';

import { useSocket } from '@/hooks/useSocket';
import { useState, useEffect } from 'react';

export default function SocketTest() {
  const { socketManager, isConnected, isConnecting, error } = useSocket();
  const [messages, setMessages] = useState<Array<{
    id: string;
    username: string;
    message: string;
    timestamp: string;
  }>>([]);
  const [messageInput, setMessageInput] = useState('');
  const [username] = useState('TestUser_' + Math.random().toString(36).substr(2, 9));
  const [roomId] = useState('test-room');

  useEffect(() => {
    if (!isConnected) return;

    // Join the test room
    socketManager.joinRoom(roomId);

    // Listen for messages
    socketManager.onMessage((data) => {
      setMessages(prev => [...prev, data]);
    });

    // Listen for user events
    socketManager.onUserJoined((data) => {
      console.log('User joined:', data);
    });

    socketManager.onUserLeft((data) => {
      console.log('User left:', data);
    });

    return () => {
      socketManager.leaveRoom(roomId);
      socketManager.removeAllListeners();
    };
  }, [isConnected, socketManager, roomId]);

  const sendMessage = () => {
    if (!messageInput.trim() || !isConnected) return;

    socketManager.sendMessage({
      roomId,
      message: messageInput,
      username,
      timestamp: new Date().toISOString(),
    });

    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Socket.IO Test</h1>
      
      {/* Connection Status */}
      <div className="mb-4 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <div 
            className={`w-3 h-3 rounded-full ${
              isConnected 
                ? 'bg-green-500' 
                : isConnecting 
                ? 'bg-yellow-500' 
                : 'bg-red-500'
            }`}
          />
          <span className="font-medium">
            {isConnected 
              ? 'Connected' 
              : isConnecting 
              ? 'Connecting...' 
              : 'Disconnected'}
          </span>
        </div>
        {error && (
          <p className="text-red-600 text-sm mt-1">Error: {error}</p>
        )}
        <p className="text-sm text-gray-600 mt-1">
          Username: {username} | Room: {roomId}
        </p>
      </div>

      {/* Messages */}
      <div className="border rounded-lg p-4 h-64 overflow-y-auto mb-4 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet...</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="mb-2 p-2 bg-white rounded border">
              <div className="flex justify-between items-start">
                <span className="font-medium text-blue-600">{msg.username}</span>
                <span className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-800 mt-1">{msg.message}</p>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!isConnected}
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected || !messageInput.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Test Instructions:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Open this page in multiple browser tabs to test real-time messaging</li>
          <li>• Check the browser console for connection logs</li>
          <li>• Messages are sent to room: {roomId}</li>
          <li>• Server running on: http://localhost:5000</li>
        </ul>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to chat by default
    router.push('/dashboard/chat');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Welcome to ChatFly
        </h1>
        <p className="text-gray-600">
          Redirecting to your chats...
        </p>
      </div>
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";

export default function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if current page should hide sidebar
  const isConversationPage = pathname?.match(/\/(chat|classroom)\/\d+$/);

  return (
    <div className="flex h-screen">
      {/* Sidebar - Hidden on conversation pages */}
      <div className={`flex shrink-0 ${isConversationPage ? 'hidden md:block' : 'block'}`}>
        <Sidebar />
      </div>
      
      {/* Main content */}
      <main className={`flex-1 bg-gray-100`}>
        {children}
      </main>
    </div>
  );
}

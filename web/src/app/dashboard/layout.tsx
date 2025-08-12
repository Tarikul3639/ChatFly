"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if current page should hide sidebar on mobile
  const isConversationPage = pathname?.match(/\/(chat|classroom)\/\d+$/);

  return (
    <div className="flex h-screen bg-gray-50 max-sm:flex-col-reverse overflow-hidden">
      {/* Sidebar - Always present for flex-col-reverse to work */}
      <div className={`shrink-0 ${isConversationPage ? 'hidden md:block' : ''}`}>
        <Sidebar />
      </div>
      
      {/* Main content area */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}

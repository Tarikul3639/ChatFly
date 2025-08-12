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
    <div className="flex h-[cal(100dvh)] bg-gray-50 overflow-hidden">
      {/* Sidebar - Use conditional rendering instead of CSS hidden to avoid accessibility issues */}
      {!isConversationPage && (
        <div className="shrink-0">
          <Sidebar />
        </div>
      )}
      
      {isConversationPage && (
        <>
          {/* Desktop sidebar for conversation pages */}
          <div className="hidden md:block shrink-0">
            <Sidebar />
          </div>
        </>
      )}
      
      {/* Main content area */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}

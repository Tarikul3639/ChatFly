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
    <>
      {/* Sidebar - Hidden on conversation pages */}
      <div className={isConversationPage ? 'hidden' : 'block'}>
        <Sidebar />
      </div>
      
      {/* Main content */}
      <main className={`bg-gray-100 ${isConversationPage ? '' : 'md:ml-16'}`}>
        {children}
      </main>
    </>
  );
}

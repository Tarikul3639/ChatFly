// web\src\app\components\Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { BotMessageSquare, MessageCircle, BookOpen, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter, usePathname } from "next/navigation";

// Define types
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const sidebarItems = [
  { id: "chat", label: "Messenger", icon: MessageCircle, active: true },
  { id: "classroom", label: "Classrooms", icon: BookOpen },
  { id: "profile", label: "Profile", icon: User },
];

// Mobile sidebar items
const mobileSidebarItems = [
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "classroom", label: "Classroom", icon: BookOpen },
  { id: "profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("chat");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userData = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "student",
    };
    setUser(userData);
  }, []);

  // Set active tab based on current pathname
  useEffect(() => {
    if (pathname === "/chat") {
      setActiveTab("chat");
    } else if (pathname === "/classroom") {
      setActiveTab("classroom");
    } else if (pathname === "/profile") {
      setActiveTab("profile");
    }
  }, [pathname]);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden sm:flex h-screen w-16 bg-gradient-to-b from-blue-600 to-indigo-700 flex-col items-center py-6 space-y-6">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <BotMessageSquare className="w-6 h-6 text-white" />
        </div>

        <div className="flex flex-col space-y-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                router.push(`/${item.id}`);
              }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                activeTab === item.id
                  ? "bg-white text-blue-600 shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon className="w-5 h-5" />
            </button>
          ))}
        </div>

        <div className="mt-auto">
          <Avatar className="w-12 h-12 border-2 border-white/20">
            <AvatarFallback className="bg-white/20 text-white">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-around items-center">
          {mobileSidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                router.push(`/${item.id}`);
              }}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all ${
                activeTab === item.id
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-blue-600" : "text-gray-500"}`} />
              <span className={`text-[11px] font-medium ${activeTab === item.id ? "text-blue-600" : "text-gray-500"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// web\src\app\components\Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { BotMessageSquare, MessageCircle, Settings, BookOpen, User, Link } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const sidebarItems = [
  { id: "chat", label: "Messenger", icon: MessageCircle, active: true },
  { id: "classroom", label: "Classrooms", icon: BookOpen },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("messenger");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();


  useEffect(() => {
    const userData = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "student",
    };
    setUser(userData);
  }, []);

  return (
      <aside className="h-screen w-20 bg-gradient-to-b from-blue-600 to-indigo-700 flex flex-col items-center py-6 space-y-6">
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
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                activeTab === item.id
                  ? "bg-white text-blue-600 shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon className="w-6 h-6" />
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
  );
}

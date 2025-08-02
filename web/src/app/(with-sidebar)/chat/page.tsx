"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Welcome from "./components/Welcome";
import { User } from "./types";

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // const userData = localStorage.getItem("chatfly-user")
    const userData = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "student",
    };
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(userData);
  }, [router]);

  if (!user) return null;

  return (
    <div className="flex flex-col flex-1 h-full">
      <Welcome userName={user?.name} />
    </div>
  );
}

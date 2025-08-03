// Shared types and data for chat functionality

export interface Chat {
  id: number;
  name: string;
  type: string;
  avatar: string;
  online: boolean;
  members?: number;
}

export interface ChatWithMessages extends Chat {
  lastMessage: string;
  timestamp: string;
  unread: number;
}

export interface MessageType {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  avatar: string;
  isOwn: boolean;
  replyTo?: MessageType;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Shared chat data
export const chats: Chat[] = [
  {
    id: 1,
    name: "Mathematics 101",
    type: "classroom",
    avatar: "M1",
    online: true,
    members: 24,
  },
  {
    id: 2,
    name: "Physics Lab",
    type: "classroom",
    avatar: "PL",
    online: true,
    members: 18,
  },
  {
    id: 3,
    name: "Dr. Smith",
    type: "direct",
    avatar: "DS",
    online: true,
  },
  {
    id: 4,
    name: "Study Group",
    type: "group",
    avatar: "SG",
    online: false,
    members: 6,
  },
  {
    id: 5,
    name: "Computer Science",
    type: "classroom",
    avatar: "CS",
    online: true,
    members: 32,
  },
];

// Chat data with additional message info for the list view
export const chatsWithMessages: ChatWithMessages[] = [
  {
    id: 1,
    name: "Mathematics 101",
    type: "classroom",
    lastMessage: "Dr. Smith: Great question about derivatives!",
    timestamp: "2 min",
    unread: 3,
    avatar: "M1",
    online: true,
    members: 24,
  },
  {
    id: 2,
    name: "Physics Lab",
    type: "classroom",
    lastMessage: "Remember to submit your lab reports",
    timestamp: "1h",
    unread: 1,
    avatar: "PL",
    online: true,
    members: 18,
  },
  {
    id: 3,
    name: "Dr. Smith",
    type: "direct",
    lastMessage: "Thank you for the great presentation!",
    timestamp: "3h",
    unread: 0,
    avatar: "DS",
    online: true,
  },
  {
    id: 4,
    name: "Study Group",
    type: "group",
    lastMessage: "See you all tomorrow for the review session",
    timestamp: "1d",
    unread: 2,
    avatar: "SG",
    online: false,
    members: 6,
  },
  {
    id: 5,
    name: "Computer Science",
    type: "classroom",
    lastMessage: "Next week we'll cover algorithms",
    timestamp: "2d",
    unread: 0,
    avatar: "CS",
    online: true,
    members: 32,
  },
  {
    id: 6,
    name: "Group Project",
    type: "group",
    lastMessage: "Let's finalize the presentation slides",
    timestamp: "2d",
    unread: 2,
    avatar: "GP",
    online: false,
    members: 10,
  },
  {
    id: 7,
    name: "History Discussion",
    type: "classroom",
    lastMessage: "Discussion on World War II",
    timestamp: "3d",
    unread: 0,
    avatar: "HD",
    online: false,
    members: 15,
  },
  {
    id: 8,
    name: "Chemistry Club",
    type: "group",
    lastMessage: "Next meeting on Friday",
    timestamp: "4d",
    unread: 0,
    avatar: "CC",
    online: false,
    members: 20,
  },
];

// Sample messages data
export const sampleMessages: MessageType[] = [
  {
    id: 1,
    sender: "Dr. Smith",
    content:
      "Good morning everyone! Today we'll be covering advanced calculus concepts.",
    timestamp: "10:30 AM",
    avatar: "DS",
    isOwn: false,
  },
  {
    id: 2,
    sender: "You",
    content: "Thank you professor! I'm ready to learn.",
    timestamp: "10:32 AM",
    avatar: "YU",
    isOwn: true,
  },
  {
    id: 3,
    sender: "Alice Johnson",
    content:
      "Could you explain the chain rule again? I'm still confused about it.",
    timestamp: "10:35 AM",
    avatar: "AJ",
    isOwn: false,
  },
];

// models/Conversation.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConversation extends Document {
  name: string;
  type: "classroom" | "group" | "direct";
  lastMessage?: mongoose.Types.ObjectId;
  avatar?: string;
  online?: boolean;
  members?: number;
  unread?: number;
  messages?: mongoose.Types.ObjectId[];
  participants: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema: Schema<IConversation> = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["classroom", "group", "direct"], required: true },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    avatar: String,
    online: { type: Boolean, default: false },
    members: { type: Number, default: 0 },
    unread: { type: Number, default: 0 },
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  },
  { timestamps: true }
);

const Conversation: Model<IConversation> = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);

export default Conversation;

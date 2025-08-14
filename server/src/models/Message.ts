import mongoose, { Document, Schema, Model } from "mongoose";

// Message type definition
export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId;  // Conversation ID
  sender: mongoose.Types.ObjectId;        // User ID
  content: string;
  type: "text" | "image" | "video" | "file";
  readBy: mongoose.Types.ObjectId[];      // Users who have read this message
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema: Schema<IMessage> = new Schema(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["text", "image", "video", "file"],
      default: "text",
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Message: Model<IMessage> = mongoose.model<IMessage>("Message", messageSchema);

export default Message;

import { Server, Socket } from "socket.io";
import { chatListHandler } from "./chatList";
import User from "../models/User";
import jwt from "jsonwebtoken";
import config from "config";
import { IUser, AuthenticatedSocket, ITokenPayload } from "./types";

export const setupSocket = (io: Server) => {
  // Middleware for authentication
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }
      // Secret key
      const key = config.get("jwt.secret") as string;
      if (!key) throw new Error("JWT secret key not found");

      // Verify the token
      const decoded = jwt.verify(token, key) as ITokenPayload;

      // Database check
      const user = await User.findById(decoded._id).select(
        "_id email username"
      );
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      // Attach user to socket
      socket.user = user as IUser;
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });
  io.on("connection", (socket: AuthenticatedSocket) => {
    console.log(
      "✅ New socket connected:",
      socket.id,
      "👤 User:",
      socket.user?.username
    );

    // Chat list handler attach
    chatListHandler(io, socket);

    socket.on("disconnect", () => {
      console.log(
        "❌ Socket disconnected:",
        socket.id,
        "👤 User:",
        socket.user?.username
      );
    });
  });
};

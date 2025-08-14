import express, { Request, Response } from "express";
import { createServer } from "https";
import { Server } from "socket.io";
import { connectDB } from "./config/db";
import { configureSockets } from "./config/socket";
import config from "config";
import fs from "fs";

const APP = express();
const PORT = config.get("app.port");
const HOST = config.get("app.host");

// SSL certificates
const SSL_OPTIONS = {
  key: fs.readFileSync("ssl/private-key.pem"),
  cert: fs.readFileSync("ssl/certificate.pem"),
};
// Create HTTPS server
const HTTPS_SERVER = createServer(SSL_OPTIONS, APP);

const io = new Server(HTTPS_SERVER, {
  cors: {
    origin: config.get("cors.origin"),
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
connectDB();

// Attach socket handlers
configureSockets(io);

// Middleware
APP.use(express.json());

APP.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to ChatFly API",
    app: config.get("app.name"),
    version: config.get("app.version"),
    environment: process.env.NODE_ENV,
  });
});

HTTPS_SERVER.listen(PORT, () => {
  console.log(
    `${config.get("app.name")} server running at https://${HOST}:${PORT}`
  );
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

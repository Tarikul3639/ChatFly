"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const https_1 = require("https");
const socket_io_1 = require("socket.io");
const db_1 = require("./config/db");
const socket_1 = require("./config/socket");
const config_1 = __importDefault(require("config"));
const fs_1 = __importDefault(require("fs"));
const APP = (0, express_1.default)();
const PORT = config_1.default.get('app.port');
const HOST = config_1.default.get('app.host');
// Connect to MongoDB
(0, db_1.connectDB)();
// SSL certificates
const SSL_OPTIONS = {
    key: fs_1.default.readFileSync("ssl/private-key.pem"),
    cert: fs_1.default.readFileSync("ssl/certificate.pem")
};
// Create HTTPS server
const HTTPS_SERVER = (0, https_1.createServer)(SSL_OPTIONS, APP);
const io = new socket_io_1.Server(HTTPS_SERVER, {
    cors: {
        origin: config_1.default.get('cors.origin'),
        methods: ["GET", "POST"]
    }
});
// Attach socket handlers
(0, socket_1.attachSocketHandlers)(io);
// Middleware
APP.use(express_1.default.json());
APP.get('/', (req, res) => {
    res.json({
        message: 'Welcome to ChatFly API',
        app: config_1.default.get('app.name'),
        version: config_1.default.get('app.version'),
        environment: process.env.NODE_ENV
    });
});
HTTPS_SERVER.listen(PORT, () => {
    console.log(`${config_1.default.get('app.name')} server running at https://${HOST}:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});

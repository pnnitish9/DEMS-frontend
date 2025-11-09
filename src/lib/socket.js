// src/lib/socket.js
import { io } from "socket.io-client";

const API_URL = "http://localhost:4000";

export const makeSocket = (token) =>
  io(API_URL, {
    path: "/socket.io",              // ✅ required
    transports: ["websocket"],       // ✅ only websocket
    auth: { token },                 // ✅ JWT to identify user
    autoConnect: Boolean(token),
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 800,
    reconnectionDelayMax: 4000,
  });

import { io } from "socket.io-client";
import { serverUrl } from "./src/App";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(serverUrl, {
      path: "/socket.io",              // MUST MATCH BACKEND
      transports: ["websocket"],       // 🔥 FORCE WEBSOCKET
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("SOCKET CONNECT ERROR:", err.message);
    });
  }
  return socket;
};

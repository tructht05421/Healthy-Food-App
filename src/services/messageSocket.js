// src/services/socketService.js
import { io } from "socket.io-client";

// Use your server's URL here
const SOCKET_URL = "http://192.168.1.225:8080"; // Replace with your actual server URL
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZGFlMWExNDcwOTEyNDc0MGU5YTQ2ZSIsImlhdCI6MTc0MjQwNzEzNywiZXhwIjoxNzUwMTgzMTM3fQ.9CJIwSafgszL7VGFFYBuYj7FcUh-WLFMcgvGbU2NDGU";

class MessageSocket {
  socket = null;

  // Initialize the socket connection
  init = (data) => {
    if (this.socket) {
      console.log("Socket already initialized");
      return;
    }

    // Create socket connection
    this.socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      withCredentials: true,
      auth: {
        token: token,
      },
    });

    // Socket connection events
    this.socket.on("connect", () => {
      console.log("Connected to server: ", data?.userId);
      data?.userId && socket.emit("join", data?.userId);
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });
  };

  // Disconnect and clean up
  disconnect = () => {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  };

  // Check if socket is connected
  isConnected = () => {
    return this.socket && this.socket.connected;
  };

  // Emit an event
  emit = (event, data) => {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.warn("Socket not initialized");
    }
  };

  // Listen for an event
  on = (event, callback) => {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.warn("Socket not initialized");
    }
  };

  // Remove listener
  off = (event) => {
    if (this.socket) {
      this.socket.off(event);
    }
  };

  // Join a room
  joinRoom = (roomId) => {
    if (this.socket) {
      this.socket.emit("join_room", roomId);
    }
  };

  // Leave a room
  leaveRoom = (roomId) => {
    if (this.socket) {
      this.socket.emit("leave_room", roomId);
    }
  };
}

export default new MessageSocket();

import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server);

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export const getSocketInstance = () => {
  if (!io) {
    throw new Error(
      "Socket.IO instance is not initialized. Please call initSocket first.",
    );
  }
  return io;
};

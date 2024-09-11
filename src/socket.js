import { Server } from 'socket.io';

let io; // Variable to hold the Socket.IO instance

export const initSocket = (server) => {
  io = new Server(server); // Initialize Socket.IO with the Express server

  // Listen for socket connections
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Optionally, you can listen for disconnects
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

export const getSocketInstance = () => {
  if (!io) {
    throw new Error('Socket.IO instance is not initialized. Please call initSocket first.');
  }
  return io; // Return the Socket.IO instance
};

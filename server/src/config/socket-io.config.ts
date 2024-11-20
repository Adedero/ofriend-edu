import { config } from 'dotenv';
import http from 'node:http';
import { Server } from 'socket.io';

config();

const initializeSocket = (server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) => {
  const io = new Server(server, {
    cors: {
      origin: [
        process.env.CLIENT_URL || '',
      ],
      methods: ["GET", "POST"],
    }
  });
  return io;
}

export default initializeSocket;

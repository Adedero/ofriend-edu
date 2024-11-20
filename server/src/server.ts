import dotenv from 'dotenv';
import http from 'node:http';
import app from './app';
import connectDb from './database/db-init';
import initializeSocket from './config/socket-io.config';

dotenv.config();

connectDb();

const server = http.createServer(app);
const PORT: string | number = process.env.PORT || 6060;

export const io = initializeSocket(server);

server.listen(PORT, () => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`Server is running in production mode on port ${PORT}`)
  } else {
    console.log(`Server is running on port http://localhost:${PORT}`)
  }
});


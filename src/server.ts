import mongoose from 'mongoose';
import config from './app/config';
import app from './app';
import http from 'http';
import { Server } from 'socket.io';
import { Message } from './app/modules/Message/Message.model';

// Create raw HTTP server
const server = http.createServer(app);

// Create socket instance
const io = new Server(server, {
  cors: {
    origin: ['https://chatpals.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  },
});

//  Socket setup
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on('sendMessage', async ({ message, sender, receiver, roomId }) => {
    const newMsg = await Message.create({
      message,
      sender: sender,
      receiver: receiver,
      roomId,
    });

    const populatedMsg = await Message.findById(newMsg._id).populate(
      'sender',
      'name email',
    );

    io.to(roomId).emit('newMessage', populatedMsg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

//  Connect to DB and start server
async function main() {
  await mongoose.connect(config.database_url as string);
  server.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });
}

main();

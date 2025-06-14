import mongoose from 'mongoose';
import config from './app/config';
import app from './app';
import http from 'http';
import { Server } from 'socket.io';
import { Message } from './app/modules/Message/Message.model';
import { sendImageToCloudinary } from './app/utils/sendImageToCloudinary';

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

  socket.on(
    'sendMessage',
    async ({ message, sender, receiver, roomId, image }) => {
      try {
        let imageUrl: string | null = null;

        if (image) {
          const result = (await sendImageToCloudinary(image)) as {
            secure_url: string;
          };
          imageUrl = result?.secure_url || null;
        }

        const trimmedMessage = message?.trim() || '';

        if (!trimmedMessage && !imageUrl) {
          return;
        }

        const newMsg = await Message.create({
          message: trimmedMessage,
          sender,
          receiver,
          roomId,
          image: imageUrl,
          readBy: [sender],
        });

        const populatedMsg = await Message.findById(newMsg._id).populate(
          'sender',
          'name email',
        );

        io.to(roomId).emit('newMessage', populatedMsg);
      } catch (err) {
        console.error('Error saving message:', err);
      }
    },
  );

  socket.on('markAsRead', async ({ roomId, userId }) => {
    try {
      await Message.updateMany(
        { roomId, receiver: userId, readBy: { $ne: userId } },
        { $addToSet: { readBy: userId } },
      );
    } catch (err) {
      console.error('Error marking messages as read', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

//  Connect to DB and start server
async function main() {
  await mongoose.connect(config.database_url as string);
  server.listen(config.port, () => {
    console.log(`Server running on ${config.port}`);
  });
}

main();

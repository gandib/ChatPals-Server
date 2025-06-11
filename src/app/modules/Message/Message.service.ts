/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { TUser } from '../User/user.interface';
import { User } from '../User/user.model';
import { Message } from './Message.model';

const getMessage = async (roomId: string) => {
  const result = await Message.find({ roomId })
    .populate('sender', 'name image email')
    .sort('createdAt');

  return result;
};

const getMutualConnections = async (user: TUser) => {
  const userData = await User.findById(user?._id);

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // Find all messages where the user is either sender or receiver
  const messages = await Message.find({
    $or: [{ sender: userData._id }, { receiver: userData._id }],
  }).populate('sender receiver', '-password');

  const uniqueRoomIds = new Set<string>();
  const connectedUserIds = new Set<string>();
  const roomToUserMap: Record<string, string> = {};

  // Extract roomIds and map to connected user IDs
  messages.forEach((msg) => {
    const roomId = msg.roomId.toString();
    if (!uniqueRoomIds.has(roomId)) {
      uniqueRoomIds.add(roomId);
      const [id1, id2] = roomId.split('_');
      const otherUserId = id1 === userData._id.toString() ? id2 : id1;
      connectedUserIds.add(otherUserId);
      roomToUserMap[roomId] = otherUserId;
    }
  });

  // Fetch connected user details
  const connections = await User.find({
    _id: { $in: Array.from(connectedUserIds) },
  }).select('-password');

  // Fetch chat history grouped by room
  const chatsByRoom = await Promise.all(
    Array.from(uniqueRoomIds).map(async (roomId) => {
      const roomChats = await Message.find({ roomId })
        .sort({ updatedAt: 1 }) // oldest to newest in each room
        .populate('sender receiver', '-password');

      return { roomId, chats: roomChats };
    }),
  );

  // Combine connections with their respective chats
  const enrichedConnections = connections.map((connection) => {
    const relatedRoomId = Object.entries(roomToUserMap).find(
      ([_, id]) => id === connection._id.toString(),
    )?.[0];

    const chatData = chatsByRoom.find((room) => room.roomId === relatedRoomId);

    return {
      ...connection.toObject(),
      chats: chatData?.chats || [],
    };
  });

  // Sort connections based on last chat time (newest first)
  const sortedConnections = enrichedConnections.sort((a, b) => {
    const aLastUpdated = a.chats?.[a.chats.length - 1]?.updatedAt;
    const bLastUpdated = b.chats?.[b.chats.length - 1]?.updatedAt;

    return new Date(bLastUpdated).getTime() - new Date(aLastUpdated).getTime();
  });

  return {
    rooms: Array.from(uniqueRoomIds),
    connections: sortedConnections,
  };
};

export const messageServices = {
  getMessage,
  getMutualConnections,
};

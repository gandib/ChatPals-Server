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

  const messages = await Message.find({
    $or: [{ sender: userData._id }, { receiver: userData._id }],
  }).select('roomId');

  const uniqueRoomIds = new Set<string>();
  const connectedUserIds = new Set<string>();

  messages.forEach((msg) => {
    const roomId = msg.roomId.toString();
    if (!uniqueRoomIds.has(roomId)) {
      uniqueRoomIds.add(roomId);
      const [id1, id2] = roomId.split('_');
      if (id1 !== userData._id.toString()) connectedUserIds.add(id1);
      if (id2 !== userData._id.toString()) connectedUserIds.add(id2);
    }
  });

  // Populate the connected users
  const populatedConnections = await User.find({
    _id: { $in: Array.from(connectedUserIds) },
  }).select('-password'); // exclude password field or any sensitive fields

  return {
    rooms: Array.from(uniqueRoomIds),
    connections: populatedConnections,
  };
};

export const messageServices = {
  getMessage,
  getMutualConnections,
};

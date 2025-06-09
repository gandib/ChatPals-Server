/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message } from './Message.model';

const getMessage = async (roomId: string) => {
  const result = await Message.find({ roomId })
    .populate('sender', 'name image email')
    .sort('createdAt');

  return result;
};

export const messageServices = {
  getMessage,
};

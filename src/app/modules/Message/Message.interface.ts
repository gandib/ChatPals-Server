/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';

export interface TMessage {
  message: string;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  roomId: string;
  createdAt: Date;
  updatedAt: Date;
}

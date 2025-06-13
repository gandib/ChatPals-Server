import { model, Schema } from 'mongoose';
import { TMessage } from './Message.interface';

const messageSchema = new Schema<TMessage>(
  {
    message: { type: String, default: '' },
    image: { type: String, default: null },
    sender: {
      type: Schema.Types.ObjectId,
      required: [true, 'Sender Id is required!'],
      ref: 'User',
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: [true, 'Receiver Id is required!'],
      ref: 'User',
    },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    roomId: { type: String, required: [true, 'Room id is required!'] },
  },
  { timestamps: true },
);

export const Message = model<TMessage>('Message', messageSchema);

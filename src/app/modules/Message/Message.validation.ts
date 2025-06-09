import { z } from 'zod';

const createMessageValidationSchema = z.object({
  body: z.object({
    sender: z.string({ required_error: 'Sender Id is required!' }),
    receiver: z.string({ required_error: 'Receiver Id is required!' }),
    message: z.string({ required_error: 'Message is required!' }),
    roomId: z.string({ required_error: 'Room id is required!' }),
  }),
});

const updateMessageValidationSchema = z.object({
  body: z.object({
    message: z.string().optional(),
  }),
});

export const messageValidations = {
  createMessageValidationSchema,
  updateMessageValidationSchema,
};

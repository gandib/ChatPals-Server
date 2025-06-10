import express from 'express';
import auth from '../../middlewares/auth';
import { messageControllers } from './Message.controller';

const router = express.Router();

router.get(
  '/mutual-chat',
  auth('user', 'admin'),
  messageControllers.getMutualConnections,
);

router.get('/:roomId', auth('user', 'admin'), messageControllers.getAllMessage);

// router.get('/', messageControllers.getAllMessage);

// router.get('/all-message', messageControllers.getAllMessageForStatusChange);

// router.get(
//   '/my-message',
//   auth('user', 'admin'),
//   messageControllers.getAllMyMessage,
// );

// router.get('/:id', auth('user', 'admin'), messageControllers.getSingleMessage);

// router.patch(
//   '/:id',
//   auth('user', 'admin'),
//   validateRequest(messageValidations.updateMessageValidationSchema),
//   messageControllers.updateMessage,
// );

// router.delete('/:id', auth('user', 'admin'), messageControllers.deleteMessage);

export const messageRoutes = router;

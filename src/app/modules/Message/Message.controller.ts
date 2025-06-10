import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { messageServices } from './Message.service';
import { JwtPayload } from 'jsonwebtoken';
import { TUser } from '../User/user.interface';

const getAllMessage = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  console.log(roomId);
  const result = await messageServices.getMessage(roomId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Message retrieved successfully',
    data: result,
  });
});

const getMutualConnections = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await messageServices.getMutualConnections(
    user as JwtPayload & TUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mutual connections retrieved successfully',
    data: result,
  });
});

// const getAllMyMessage = catchAsync(async (req, res) => {
//   const { _id } = req.user;
//   const result = await messageServices.getAllMyMessage(
//     _id as string,
//     req.query,
//   );

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Message retrieved successfully',
//     data: result,
//   });
// });

// const getSingleMessage = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await messageServices.getSingleMessage(id);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Message retrieved successfully',
//     data: result,
//   });
// });

// const updateMessage = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await messageServices.updateMessage(id as string, req.body);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Message updated successfully',
//     data: result,
//   });
// });

// const deleteMessage = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await messageServices.deleteMessage(id as string);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Message deleted successfully',
//     data: result,
//   });
// });

export const messageControllers = {
  getAllMessage,
  getMutualConnections,
  // getSingleMessage,
  // updateMessage,
  // deleteMessage,
  // getAllMyMessage,
};

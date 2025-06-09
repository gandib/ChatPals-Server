/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { TLoginUser, TUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../errors/appError';
import config from '../../config';
import { createToken, verifyToken } from './user.utils';
import { sendEmail } from '../../utils/sendEmail';
import bcrypt from 'bcrypt';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createUser = async (file: any, payload: TUser) => {
  const isUserExists = await User.findOne({ email: payload.email });
  if (isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists!');
  }

  try {
    if (file) {
      // const imageName = `${payload?.email}${payload?.name}`;
      const path = file?.path;

      // send image to cloudinary
      const { secure_url } = await sendImageToCloudinary(path);
      payload.image = secure_url as string;
    }
  } catch (error) {
    console.log(error);
  }

  if (payload.image === ' ') {
    payload.image = config.profile_photo!;
  }

  const user = await User.create(payload);
  const result = await User.findById(user?._id).select('-password');

  return result;
};

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByEmail(payload?.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Data Found');
  }

  // checking if password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password is not matched!');
  }

  const jwtPayload = {
    _id: user?._id,
    name: user?.name,
    email: user?.email,
    role: user?.role,
    status: user?.status,
    image: user?.image,
    bio: user?.bio,
  };

  const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '7d',
  });

  const userData = await User.findOne({ email: payload?.email });

  return {
    token,
    userData,
  };
};

const getAllUser = async () => {
  const result = await User.find({ role: { $ne: 'admin' } }).select(
    '-password',
  );

  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'Users Not found!');
  }
  return result;
};

const getAllAdmin = async () => {
  const result = await User.find({ role: { $ne: 'user' } }).select('-password');

  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin Not found!');
  }
  return result;
};

const getUser = async (email: string) => {
  const result = await User.findOne({ email: email })
    .select('-password')
    .populate('follower following');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
  }
  return result;
};

const getUserById = async (id: string) => {
  const result = await User.findById(id)
    .select('-password')
    .populate('follower following');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
  }
  return result;
};

const updateUser = async (id: string, payload: TUser) => {
  const user = await User.findById(id).select('-password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(config.bcrypt_salt_rounds),
    );
  }

  const result = await User.findByIdAndUpdate(
    id,
    {
      name: payload.name,
      password: payload.password,
      image: payload.image,
      bio: payload.bio,
    },
    { new: true },
  );

  return result;
};

const deleteUser = async (id: string) => {
  const user = await User.findById(id).select('-password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
  }

  const result = await User.findByIdAndDelete(id);

  return result;
};

const updateUserStatus = async (
  id: string,
  payload: { status: string; id: string },
) => {
  const user = await User.findById(id).select('-password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
  }

  const result = await User.findByIdAndUpdate(
    payload.id,
    { status: payload.status },
    { new: true },
  );

  return result;
};

const forgetPassword = async (userId: string) => {
  //checking if the user is exists
  const user = await User.findOne({ email: userId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found!');
  }

  // checking user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is already blocked!');
  }

  // create token and send to the user
  const jwtPayload = {
    _id: user?._id,
    name: user?.name,
    email: user?.email,
    role: user?.role,
    status: user?.status,
    image: user?.image,
    bio: user?.bio,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetUILink = `${config.reset_password_ui_link}?id=${user?._id}&token=${resetToken}`;
  await sendEmail(user?.email, resetUILink);
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  //checking if the user is exists
  const user = await User.findById(payload.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found!');
  }

  // checking user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is already blocked!');
  }

  // check if the token is valid and id is same of user
  const decoded = verifyToken(token, config.jwt_access_secret as string);

  const { _id, role } = decoded;
  if (payload?.id !== _id) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      _id,
      role: role,
    },
    {
      password: newHashedPassword,
    },
  );
};

export const userServices = {
  createUser,
  loginUser,
  getUser,
  forgetPassword,
  resetPassword,
  updateUser,
  updateUserStatus,
  deleteUser,
  getAllUser,
  getAllAdmin,
  getUserById,
};

import { Model } from 'mongoose';

export type TUserRole = 'admin' | 'user';
export type TUserStatus = 'blocked' | 'unblocked';

export interface TUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  image: string;
  bio: string;
  status: TUserStatus;
}

export interface TLoginUser {
  email: string;
  password: string;
}

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

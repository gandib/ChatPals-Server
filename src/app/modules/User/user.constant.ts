import { TUserMembership, TUserRole, TUserStatus } from './user.interface';

export const role: TUserRole[] = ['admin', 'user'];
export const status: TUserStatus[] = ['blocked', 'unblocked'];
export const membership: TUserMembership[] = ['basic', 'premium'];

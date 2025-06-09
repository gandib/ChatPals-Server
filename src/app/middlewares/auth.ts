import jwt, { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import AppError from '../errors/appError';
import catchAsync from '../utils/catchAsync';
import config from '../config';
import { TUserRole } from '../modules/User/user.interface';
import { User } from '../modules/User/user.model';
import AuthError from '../errors/authError';

const auth = (...requiredRole: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    // if token is sent from the client
    if (!token) {
      throw new AuthError(
        httpStatus.UNAUTHORIZED,
        'You have no access to this route',
      );
    }

    // check if the token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, email } = decoded;

    //checking if the user is exists
    const user = await User.isUserExistsByEmail(email);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'Data Not Found!');
    }

    if (requiredRole && !requiredRole.includes(role)) {
      throw new AuthError(
        httpStatus.UNAUTHORIZED,
        'You have no access to this route',
      );
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;

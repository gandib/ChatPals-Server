import jwt, { JwtPayload, type Secret, type SignOptions } from 'jsonwebtoken';

export const createToken = (
  jwtPayLoad: { name: string; role: string; email: string },
  secret: Secret,
  expiresIn: SignOptions['expiresIn'],
) => {
  return jwt.sign(jwtPayLoad, secret as Secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};

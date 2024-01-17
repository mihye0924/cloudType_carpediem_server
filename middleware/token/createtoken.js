import Dotenv from 'dotenv';
Dotenv.config();
import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '10s' });
}

export const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '1d' });
}

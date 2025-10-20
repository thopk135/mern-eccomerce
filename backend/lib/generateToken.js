import jwt from 'jsonwebtoken';
import redis from './redis.js';

export const generateToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });

  return { token, refreshToken };
}

export const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refresh_token:${userId}`, refreshToken, 'EX', 60 * 60 * 24 * 7); // 7 days
};

export const setCookie = async (res ,accessToken,refreshToken ) => {
  res.cookie("access_token",accessToken,{
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000, 
  });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
}

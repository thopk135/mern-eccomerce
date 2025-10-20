import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken,storeRefreshToken,setCookie } from "../lib/generateToken.js";
import jwt from "jsonwebtoken";
import redis from "../lib/redis.js";

export const signup = async (req, res) => {
  try {
    const {email,username,password} = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({message: 'Invalid email format'});
    }
    const existEmail = await User.findOne({email});
    if (existEmail) {
      return res.status(400).json({message: 'Email already exists'});
    }
    if (!username || !password) {
      return res.status(400).json({message: 'Username and password are required'});
    }
    const existingUser = await User.findOne({username});
    if (existingUser) {
      return res.status(400).json({message: 'Username already exists'});
    }
    if(username.length < 3 || username.length > 20) {
      return res.status(400).json({message: 'Username must be at least 3 characters and at most 20 characters long'});
    }
    if(password.length < 6 || password.length > 20) {
      return res.status(400).json({message: 'Password must be at least 6 characters and at most 20 characters long'});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });
    if(newUser) {
      const { token, refreshToken } = generateToken(newUser._id);
      await storeRefreshToken(newUser._id, refreshToken);
      setCookie(res, token, refreshToken);
      await newUser.save();
      res.status(201).json({success:true,
        user:{
            _id: newUser._id,
            name: newUser.username,
            email: newUser.email,
            role: newUser.role, 
        },
        message:"User created successfully"
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const login = async (req, res) => {
  try {
    const {email,password} = req.body;
    const user = await User.findOne({ email });
    const isPasswordValid = user && (await bcrypt.compare(password, user.password));
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    if (!user || !isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if(user&&isPasswordValid){
      const {token,refreshToken} = generateToken(user._id);
      await storeRefreshToken(user._id, refreshToken);
      setCookie(res, token, refreshToken);
      res.status(200).json({ success: true, user: 
        { _id: user._id, 
          email: user.email,
          name: user.name,
          role: user.role,
        },
        message: "Login successful" });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
  
}

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      await redis.del(`refresh_token:${decoded.id}`);
    }
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(200).json({ message: "Logout successful", success: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if(!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedRefreshToken = await redis.get(`refresh_token:${decoded.id}`);
    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    const accessToken = jwt.sign({ id: decoded.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    res.cookie('access_token', accessToken, 
      { httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
       });

    res.status(200).json({
      success: true,
      accessToken,
      message: 'Access token refreshed successfully'
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const getProfile = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

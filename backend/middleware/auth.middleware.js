import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        const access_token = req.cookies.access_token;
        if(!access_token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        try {
            const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            req.user = user;
            next();
        } catch (error) {
            if(error.name ==="TokenExpiredError"){
                return res.status(401).json({ message: "Unauthorized - Token expired" });
            }
            throw error;
        }
    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        res.status(500).json({ message: "Unauthorized - Invalid access token" });
    }
}

export const adminRoute = (req,res,next) => {
    if(req.user&&req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Access denied - Admins only" });
    }
}
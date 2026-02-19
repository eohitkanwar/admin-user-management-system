import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "MyAPP_Rohit"
    );

    console.log("DECODED TOKEN:", decoded);

    // 🔥 FIX HERE
    req.user = await User.findById(decoded.user.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("JWT ERROR:", error);
    
    // Handle different JWT errors with specific messages
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token format",
        error: "JWT malformed"
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: "Token expired",
        error: "Please login again"
      });
    } else if (error.name === 'NotBeforeError') {
      return res.status(401).json({ 
        success: false,
        message: "Token not active",
        error: "Token not yet valid"
      });
    } else {
      return res.status(401).json({ 
        success: false,
        message: "Token verification failed",
        error: error.message
      });
    }
  }
};


export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only you are unauthorize" });
  }
  next();
};

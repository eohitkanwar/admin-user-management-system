import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    console.log("Auth middleware - Headers:", req.headers.authorization);

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("Auth middleware - Token extracted:", token ? "Present" : "Missing");
    }

    if (!token) {
      console.log("Auth middleware - No token found");
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
      console.log("Auth middleware - User not found in database");
      return res.status(401).json({ message: "User not found" });
    }

    console.log("Auth middleware - User authenticated:", req.user.username, "Role:", req.user.role);
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
  console.log("Admin check - User:", req.user ? req.user.username : 'No user');
  console.log("Admin check - Role:", req.user ? req.user.role : 'No role');
  
  if (!req.user) {
    console.log("Admin check failed: No user found");
    return res.status(403).json({ 
      success: false,
      message: "User not authenticated",
      error: "Please login first"
    });
  }
  
  if (req.user.role !== "admin") {
    console.log("Admin check failed: User is not admin");
    return res.status(403).json({ 
      success: false,
      message: "Admin access only you are unauthorize",
      error: `User role: ${req.user.role}, Required: admin`
    });
  }
  
  console.log("Admin check passed");
  next();
};

// updated check code 
import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Rename "protect" to "authenticate"
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(401).json({ message: "User not found, token invalid" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, invalid token",
      error: error.message,
    });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Admins only." });
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `User role ${req.user.role} is not authorized to access this resource`,
      });
    }
    next();
  };
};

export { authenticate as protect };

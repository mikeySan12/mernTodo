// import jwt from 'jsonwebtoken';

// const userAuth = (req, res, next) => {
//     try {
//         const { token } = req.cookies;

//         if (!token) {
//             return res.status(401).json({ message: "Authorization failed: No token provided" });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRETS);

//         if (!decoded.id) {
//             return res.status(401).json({ message: "Authorization failed: Invalid token payload" });
//         }

//         // Ensure req.body exists so we can add userId
//         if (!req.body) {
//             req.body = {};
//         }

//         req.body.userId = decoded.id;

//         next();

//     } catch (error) {
//         console.error("JWT Verify Error:", error);

//         if (error.name === "TokenExpiredError") {
//             return res.status(401).json({ message: "Authorization failed: Token expired" });
//         }
//         if (error.name === "JsonWebTokenError") {
//             return res.status(401).json({ message: `Authorization failed: ${error.message}` });
//         }

//         return res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

// export default userAuth;

import jwt from "jsonwebtoken";
import userModel from "../models/userModels.js";

const userAuth = async (req, res, next) => {
  try {
    // Check token from cookies or Authorization header
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRETS);

    // Find user
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

export default userAuth;


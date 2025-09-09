import jwt from "jsonwebtoken";
import User from "../models/userModels.js";

const authenticateUser = async (req, res, next) => {
  try {
    // Extract token from cookies or Authorization header
    const authToken =
      req.cookies?.authToken || req.headers.authorization?.replace("Bearer ", "");
    if (!authToken) {
      return res.status(401).json({ success: false, error: "Authentication failed: Token missing" });
    }

    // Validate token
    const payload = jwt.verify(authToken, process.env.JWT_SECRETS);

    // Retrieve user
    const userRecord = await User.findById(payload.userId).select("-password");
    if (!userRecord) {
      return res.status(401).json({ success: false, error: "Authentication failed: User not found" });
    }

    req.user = userRecord; // Attach user to request
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    res.status(401).json({ success: false, error: "Authentication failed: Invalid token" });
  }
};

export default authenticateUser;
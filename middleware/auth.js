// AutoLogServer Middleware for Authentication
// This middleware checks for a valid JWT token in the request headers
const jwt = require("jsonwebtoken");

console.log("Auth middleware loaded");

// Middleware to authenticate user based on JWT token
const auth = (req, res, next) => {
  // Check for token in Authorization header
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token, access denied" });

  // Verify the token
  console.log("Verifying token:", token);
  try {
    // Decode the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = auth;
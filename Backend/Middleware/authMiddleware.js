const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
 const token = req.cookies.token; 
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }
  try {
    const JWT_SECRET = "mysecretkey";
    const decoded = jwt.verify(token,JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
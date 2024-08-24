import jwt from 'jsonwebtoken';
import { jwtSecret } from '../../constant.js';

const authMiddleware = (req, res, next) => {
    const secretKey = process.env.JWT_SECRET_KEY;
    console.log(secretKey, "secret")

  // Get the token from cookies
  const token = req.cookies.token;

  console.log(token, "sfsfAWrw")

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Attach user data to request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

export default authMiddleware;

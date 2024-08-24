import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET_KEY;


const generateJWT = (user) => {
  if (!secretKey) {
    throw new Error("Secret key is undefined or not provided");
  }

  const token = jwt.sign({ id: user.id, username: user.username }, secretKey, {
    expiresIn: "7d",
  });
  return token;
};

export default generateJWT;
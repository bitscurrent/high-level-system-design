
import bcrypt from "bcryptjs";
// import generateJWT from "../utils/jwt.util";
import express from 'express';
import { PrismaClient } from '@prisma/client';
import generateJWT from "../utils/jwt.util.js";

const prisma = new PrismaClient();


const signup= ('/signup', async (req, res) => {

    const { username, password, fullName, email } = req.body;

    try {
      // Check if the email or username already exists
      const existingUser = await prisma.users.findFirst({
        where: {
          OR: [
            { email },
            { username }
          ]
        }
      });
  
      if (existingUser) {
        return res.status(400).json({ error: 'Email or username already in use' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const user = await prisma.users.create({
        data: {
          username,
          password: hashedPassword,
          fullName,
          email,
          id: crypto.randomUUID() // Generate a unique ID
        }
      });
  
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    
});



const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
   
     // Check if the user exists in the database by email
     const user = await prisma.users.findFirst({
      where: {
        email: email
      }
    });

    if (!user) {
      // User does not exist
      return res.status(404).json({ message: "Sorry, user doesn't exist" });
    }

    // Compare the provided password with the hashed password in the database
    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      // Password does not match
      return res.status(401).json({ message: "Incorrect password" });
    }

        // Upon Successfully auth, generate the jwt token
        const token = generateJWT(user)

  // Set the token in cookies
  res.cookie("token", token, {
    httpOnly: true, // Helps prevent XSS attacks
    secure: false, // Set to false for development (over HTTP)
    sameSite: "Lax", // Helps prevent CSRF attacks
    maxAge: 24 * 60 * 60 * 1000,// 1 day expiration
    path: '/'
  });      


    // User authentication successful
    res.status(200).json({ message: "Login successful",
      user: user
     });

   
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const logoutUser = async(req, res)=>{

try{
   // Clean the token in cookies by putting empty string
   res.cookie("token", "", {
    httpOnly: true, // Helps prevent XSS attacks
    secure: false, // Set to false for development (over HTTP)
    sameSite: "strict", // Helps prevent CSRF attacks
     expires: new Date(0) // Set expiration date to past to delete cookie

  })

  res.status(200).json({ message: "Logout successful" });
} catch (error) {
  console.error("Error during logout:", error);
  res.status(500).json({ message: "Internal server error" });
}
    
}
    



export {signup, loginUser, logoutUser}

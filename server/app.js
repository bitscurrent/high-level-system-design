import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express()

// Middlewares
// CORS configuration to allow requests from localhost:5173
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,  // This allows cookies to be sent from the frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  };
  
app.use(cors(corsOptions));
app.use(express.json());
// app.use(express.urlencoded({ extended: true, limit: "16kb" })); // To receive data from URL
app.use(express.urlencoded()); // To receive data from URL

app.use(express.static("public")); // for file or image storage in server
app.use(cookieParser());

// Routes import
import uploadRouter from "./routes/upload.route.js";

// routes declaration
app.use("/api/v1/upload", uploadRouter);

export {app}
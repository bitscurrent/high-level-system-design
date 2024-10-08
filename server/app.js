import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import kafkaPublisherRouter from "./uploadServices/routes/kafkapublisher.route.js"


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

app.use('/publish', kafkaPublisherRouter);

// Routes import
import uploadRouter from "./uploadServices/routes/upload.route.js";
import getAllVideos from './uploadServices/controllers/home.controller.js';
import userRouter from "./uploadServices/routes/user.route.js"
// routes declaration
app.use("/api/v1/upload", uploadRouter);

// routes for users
app.use("/api/v1/auth", userRouter);


// routes for home
app.get("/api/v1/home", getAllVideos)

export {app}
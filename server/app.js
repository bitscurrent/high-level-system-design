import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // To receive data from URL
app.use(express.static("public")); // for file or image storage in server
app.use(cookieParser());

// Routes import
import uploadRouter from "./routes/upload.route.js";

// routes declaration
app.use("/api/v1/upload", uploadRouter);

export {app}
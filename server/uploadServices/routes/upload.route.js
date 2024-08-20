import {Router} from "express"
import { uploadFileToS3, uploadHardcodedVideo} from "../controllers/upload.controller.js";
import multer from 'multer';
import { configDotenv } from 'dotenv';
import { uploadChunkFileToS3 } from "../controllers/uploadChunk.controller.js";

configDotenv(); 


const upload = multer(); // Initialize multer

const router = Router();

// Route for handling file upload with multer
router.route("/video").post(upload.single('file'), uploadFileToS3); 

// router.route("/chunk-video").post(upload.fields([{ name: "chunk", maxCount: 1 }]), uploadFileToS3);


// Backend Route
router.route("/chunk-video").post(upload.fields([{ name: "chunk", maxCount: 1 }]), uploadChunkFileToS3);



router.route("/video-hardcoded").post(uploadHardcodedVideo);

export default router;
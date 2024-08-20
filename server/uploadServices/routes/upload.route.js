import {Router} from "express"
import { uploadFileToS3, uploadHardcodedVideo} from "../controllers/upload.controller.js";
import multer from 'multer';
import { configDotenv } from 'dotenv';
import { uploadChunkFileToS3 } from "../controllers/uploadChunk.controller.js";
import { completeUpload, initializeUpload, multipartUploadFileToS3, uploadChunk } from "../controllers/multipartUpload.controller.js";

configDotenv(); 


const upload = multer(); // Initialize multer

const router = Router();

// Route for handling file upload with multer
router.route("/video").post(upload.single('file'), uploadFileToS3); 

// router.route("/chunk-video").post(upload.fields([{ name: "chunk", maxCount: 1 }]), uploadFileToS3);


// Backend Route
router.route("/chunk-video").post(upload.fields([{ name: "chunk", maxCount: 1 }]), uploadChunkFileToS3);

router.route("/multipart-video").post(multipartUploadFileToS3);


// Route for initializing upload
router.post('/initialize', upload.none(), initializeUpload);
// Route for uploading individual chunks
router.post('/', upload.single('chunk'), uploadChunk);
// Route for completing the upload
router.post('/complete', completeUpload);


router.route("/video-hardcoded").post(uploadHardcodedVideo);
// Middleware to handle file upload
// router.route('/upload', upload.single('file'), multipartUploadFileToS3);



export default router;






import aws from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import {configDotenv} from "dotenv"

configDotenv();

// AWS S3 configuration
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Multer configuration for handling file uploads
const upload = multer();

// Function to upload a hardcoded video file from the server's filesystem to S3
const uploadHardcodedVideo = async (req, res) => {
    const filePath = "./videofile.mp4";

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.log('File does not exist:', filePath);
        return res.status(400).json({ error: 'File does not exist' });
    }

    // Read the file content
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    // S3 upload parameters
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `videos/${fileName}`,  
        Body: fileContent,
        ContentType: 'video/mp4',  // Ensure the content type is correct for video files
    };

    // Uploading file to S3
    try {
        const data = await s3.upload(params).promise();
        console.log('File uploaded successfully. S3 URL:', data.Location);
        res.status(200).json({ message: 'File uploaded successfully', url: data.Location });
    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).json({ error: 'Error uploading file' });
    }
}

// Function to handle file uploads via form data and upload to S3
const uploadFileToS3 = async (req, res) => {
    // Check if a file is included in the request
    if (!req.file) {
        console.log('No file received');
        return res.status(400).json({ error: 'No file received' });
    }

    const fileContent = req.file.buffer; // Get file content from buffer
    const fileName = req.file.originalname; // Get the original file name

    // S3 upload parameters
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `uploads/${fileName}`,  // Save the file in an 'uploads' folder in S3
        Body: fileContent,
        ContentType: req.file.mimetype,  // Set the content type based on the uploaded file
    };

    // Uploading file to S3
    try {
        const data = await s3.upload(params).promise();
        console.log('File uploaded successfully. S3 URL:', data.Location);
        res.status(200).json({ message: 'File uploaded successfully', url: data.Location });
    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).json({ error: 'Error uploading file' });
    }
}

export { uploadHardcodedVideo, uploadFileToS3 };

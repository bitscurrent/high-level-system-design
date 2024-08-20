
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


// uploadFileToS3 function (simplified)
const uploadChunkFileToS3 = async (req, res) => {
    const { chunkIndex, totalChunks } = req.body;
    const chunk = req.files.chunk[0];

    if (!chunk) {
        return res.status(400).json({ error: 'No file chunk received' });
    }

    const fileContent = chunk.buffer; // Buffer content of the chunk
    const fileName = chunk.originalname;

    // S3 upload parameters (use a unique name for each chunk, e.g., including chunkIndex)
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `uploads/${fileName}-${chunkIndex}`, // Unique key for each chunk
        Body: fileContent,
        ContentType: chunk.mimetype,
    };

    try {
        const data = await s3.upload(params).promise();
        console.log(`Chunk ${chunkIndex} uploaded successfully. S3 URL:`, data.Location);
        res.status(200).json({ message: `Chunk ${chunkIndex} uploaded successfully`, url: data.Location });
    } catch (err) {
        console.error('Error uploading chunk:', err);
        res.status(500).json({ error: 'Error uploading chunk' });
    }
};


export {uploadChunkFileToS3}
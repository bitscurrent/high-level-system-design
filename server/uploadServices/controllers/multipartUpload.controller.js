
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { addVideoDetailsToDB } from '../database/db.js';
import { pushVideoForEncodingToKafka } from './kafkapublisher.controller.js';

const multipartUploadFileToS3 = async (req, res) => {
  console.log('Upload request received');

//   const filePath = "./videofile.mp4";
// const filePath = "./82MBVideo.mp4" 
const filePath = "./50MB.mp4" 


  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist:', filePath);
    return res.status(400).send('File does not exist');
  }

  // AWS S3 configuration
  AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const s3 = new AWS.S3({
    maxRetries: 4, // number of retries
    httpOptions: {
        timeout: 300000*3, // 15 minutes
      },
  });

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: path.basename(filePath), // Use the original file name as the key
    ContentType: 'video/mp4',
  };

  try {
    console.log('Creating Multipart Upload');
    const multipartParams = await s3.createMultipartUpload(uploadParams).promise();

    const fileSize = fs.statSync(filePath).size;
    const chunkSize = 1024 * 1024 * 5; // 5MB chunk size
    const numParts = Math.ceil(fileSize / chunkSize);
    const uploadedETags = []; // To store ETags for each part

    for (let i = 0; i < numParts; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, fileSize);

      const partParams = {
        Bucket: uploadParams.Bucket,
        Key: uploadParams.Key,
        UploadId: multipartParams.UploadId,
        PartNumber: i + 1,
        Body: fs.createReadStream(filePath, { start, end }),
        ContentLength: end - start,
      };

      console.log(`Uploading part ${i + 1} of ${numParts}`);
      const data = await s3.uploadPart(partParams).promise();
      console.log(`Uploaded part ${i + 1}: ${data.ETag}`);

      uploadedETags.push({ PartNumber: i + 1, ETag: data.ETag });
    }

    const completeParams = {
      Bucket: uploadParams.Bucket,
      Key: uploadParams.Key,
      UploadId: multipartParams.UploadId,
      MultipartUpload: { Parts: uploadedETags },
    };

    const completeData = await s3.completeMultipartUpload(completeParams).promise();
    console.log('Completed multipart upload:', completeData);
    res.status(200).send('Multipart upload completed successfully');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error uploading file');
  }
};

// Initialize upload
const initializeUpload = async (req, res) => {

    try {
        console.log('Initialising Upload');
        const {filename} = req.body;
        console.log(filename);
 
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: 'ap-southeast-2'
        });
 
        const bucketName = process.env.S3_BUCKET_NAME;
 
        const createParams = {
            Bucket: bucketName,
            Key: filename,
            ContentType: 'video/mp4'
        };
 
        const multipartParams = await s3.createMultipartUpload(createParams).promise();
        console.log("multipartparams---- ", multipartParams);
        const uploadId = multipartParams.UploadId;
 
        res.status(200).json({ uploadId });
    } catch (err) {
        console.error('Error initializing upload:', err);
        res.status(500).send('Upload initialization failed');
    }
 };


 // Complete upload
 const completeUpload = async (req, res) => {
    try {
        console.log('Completing Upload');
        const { filename, totalChunks, uploadId, title, description, author } = req.body;
 
        const uploadedParts = [];
 
        // Build uploadedParts array from request body
        for (let i = 0; i < totalChunks; i++) {
            uploadedParts.push({ PartNumber: i + 1, ETag: req.body[`part${i + 1}`] });
        }
 
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: 'ap-southeast-2'
        });
        const bucketName = process.env.S3_BUCKET_NAME;
 
        const completeParams = {
            Bucket: bucketName,
            Key: filename,
            UploadId: uploadId,
        };
 
        // Listing parts using promise
        const data = await s3.listParts(completeParams).promise();
 
        const parts = data.Parts.map(part => ({
            ETag: part.ETag,
            PartNumber: part.PartNumber
        }));
 
        completeParams.MultipartUpload = {
            Parts: parts
        };
 
        // Completing multipart upload using promise
        const uploadResult = await s3.completeMultipartUpload(completeParams).promise();
 
        console.log("data----- ", uploadResult);
 
        await addVideoDetailsToDB(title, description , author, uploadResult.Location);
        pushVideoForEncodingToKafka(title, uploadResult.Location);
        return res.status(200).json({ message: "Uploaded successfully!!!" });
 
    } catch (error) {
        console.log('Error completing upload :', error);
        return res.status(500).send('Upload completion failed');
    }
 };
 

    // Upload chunk
const uploadChunk = async (req, res) => {
    try {
        console.log('Uploading Chunk');
        const { filename, chunkIndex, uploadId } = req.body;
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: 'ap-southeast-2'
        });
        
        const bucketName = process.env.S3_BUCKET_NAME;
 
        const partParams = {
            Bucket: bucketName,
            Key: filename,
            UploadId: uploadId,
            PartNumber: parseInt(chunkIndex) + 1,
            Body: req.file.buffer,
        };
 
        const data = await s3.uploadPart(partParams).promise();
        console.log("data------- ", data);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error uploading chunk:', err);
        res.status(500).send('Chunk could not be uploaded');
    }
 };
 
 
const uploadToDb = async (req, res) => {
  try {
    const videoDetails = req.body;
    await addVideoDetailsToDB(videoDetails.title, videoDetails.description, videoDetails.author, videoDetails.url);
    console.log("Adding details to DB");
    return res.status(200).send("success");
  } catch (error) {
    console.log("Error in adding to DB", error);
    return res.status(400).send("error");
  }
}


export { multipartUploadFileToS3, initializeUpload,completeUpload, uploadChunk, uploadToDb};

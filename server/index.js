
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import aws from 'aws-sdk';
import fs from 'fs';
import path from 'path';

config();
const app = express();

// AWS S3 configuration
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Middlewares
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080;

app.post('/api/v1/upload', async (req, res) => {
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
    Key: `videos/${fileName}`,  // Save the file in a 'videos' folder in S3
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
});

app.get('/api/v1/test', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

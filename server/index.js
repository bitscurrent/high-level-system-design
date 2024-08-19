
import { config } from 'dotenv';
import aws from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import {app} from "./app.js"
config();

// AWS S3 configuration
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});



const port = process.env.PORT || 8080;


app.get('/api/v1/test', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

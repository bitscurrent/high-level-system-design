
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

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

export { multipartUploadFileToS3 };

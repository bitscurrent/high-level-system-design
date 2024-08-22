// import {configDotenv} from "dotenv";
// import AWS from 'aws-sdk';
// import fs from "fs";
// import path from "path";
// import ffmpeg from "fluent-ffmpeg"
// import ffmpegStatic from "ffmpeg-static"
// ffmpeg.setFfmpegPath(ffmpegStatic)

// configDotenv()

// const s3 = new AWS.S3({
//    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//    region: process.env.AWS_REGION

// });

// const mp4FileName = '5MB.mp4';
// const bucketName = process.env.S3_BUCKET_NAME
// const hlsFolder = 'hls';
 
// // Log bucket name to ensure it is loaded
// console.log('Bucket Name:', bucketName);

// const s3ToS3 = async () => {
//    console.log('Starting script');
//    console.time('req_time');
//    try {
//        console.log('Downloading s3 mp4 file locally');
//        const mp4FilePath = `${mp4FileName}`;
//        const writeStream = fs.createWriteStream('local.mp4');
//        const readStream = s3
//            .getObject({ Bucket: bucketName, Key: mp4FilePath })
//            .createReadStream();
//        readStream.pipe(writeStream);
//        await new Promise((resolve, reject) => {
//            writeStream.on('finish', resolve);
//            writeStream.on('error', reject);
//        });
//        console.log('Downloaded s3 mp4 file locally');

//        const resolutions = [
//            {
//                resolution: '320x180',
//                videoBitrate: '500k',
//                audioBitrate: '64k'
//            },
//            {
//                resolution: '854x480',
//                videoBitrate: '1000k',
//                audioBitrate: '128k'
//            },
//            {
//                resolution: '1280x720',
//                videoBitrate: '2500k',
//                audioBitrate: '192k'
//            }
//        ];


//        const variantPlaylists = [];
//        for (const { resolution, videoBitrate, audioBitrate } of resolutions) {
//            console.log(`HLS conversion starting for ${resolution}`);
//            const outputFileName = `${mp4FileName.replace(
//                '.',
//                '_'
//            )}_${resolution}.m3u8`;
//            const segmentFileName = `${mp4FileName.replace(
//                '.',
//                '_'
//            )}_${resolution}_%03d.ts`;
//            await new Promise((resolve, reject) => {
//                ffmpeg('./local.mp4')
//                    .outputOptions([
//                        `-c:v h264`,
//                        `-b:v ${videoBitrate}`,
//                        `-c:a aac`,
//                        `-b:a ${audioBitrate}`,
//                        `-vf scale=${resolution}`,
//                        `-f hls`,
//                        `-hls_time 10`,
//                        `-hls_list_size 0`,
//                        `-hls_segment_filename hls/${segmentFileName}`
//                    ])
//                    .output(`hls/${outputFileName}`)
//                    .on('end', () => resolve())
//                    .on('error', (err) => reject(err))
//                    .run();
//            });
//            const variantPlaylist = {
//                resolution,
//                outputFileName
//            };
//            variantPlaylists.push(variantPlaylist);
//            console.log(`HLS conversion done for ${resolution}`);
//        }
//        console.log(`HLS master m3u8 playlist generating`);
//        let masterPlaylist = variantPlaylists
//            .map((variantPlaylist) => {
//                const { resolution, outputFileName } = variantPlaylist;
//                const bandwidth =
//                    resolution === '320x180'
//                        ? 676800
//                        : resolution === '854x480'
//                        ? 1353600
//                        : 3230400;
//                return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n${outputFileName}`;
//            })
//            .join('\n');
//        masterPlaylist = `#EXTM3U\n` + masterPlaylist;


//        const masterPlaylistFileName = `${mp4FileName.replace(
//            '.',
//            '_'
//        )}_master.m3u8`;
//        const masterPlaylistPath = `hls/${masterPlaylistFileName}`;
//        fs.writeFileSync(masterPlaylistPath, masterPlaylist);
//        console.log(`HLS master m3u8 playlist generated`);


//        console.log(`Deleting locally downloaded s3 mp4 file`);


//        fs.unlinkSync('local.mp4');
//        console.log(`Deleted locally downloaded s3 mp4 file`);


//        console.log(`Uploading media m3u8 playlists and ts segments to s3`);


//        const files = fs.readdirSync(hlsFolder);
//        for (const file of files) {
//            if (!file.startsWith(mp4FileName.replace('.', '_'))) {
//                continue;
//            }
//            const filePath = path.join(hlsFolder, file);
//            const fileStream = fs.createReadStream(filePath);
//            const uploadParams = {
//                Bucket: bucketName,
//                Key: `${hlsFolder}/${file}`,
//                Body: fileStream,
//                ContentType: file.endsWith('.ts')
//                    ? 'video/mp2t'
//                    : file.endsWith('.m3u8')
//                    ? 'application/x-mpegURL'
//                    : null
//            };
//            await s3.upload(uploadParams).promise();
//            fs.unlinkSync(filePath);
//        }
//        console.log(
//            `Uploaded media m3u8 playlists and ts segments to s3. Also deleted locally`
//        );


//        console.log('Success. Time taken: ');
//        console.timeEnd('req_time');
//    } catch (error) {
//        console.error('Error:', error);
//    }
// };


// export default s3ToS3;


import { config as configDotenv } from 'dotenv';
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

ffmpeg.setFfmpegPath(ffmpegStatic);

// Load environment variables
configDotenv();

// Initialize AWS S3 client
const s3 = new AWS.S3({
   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
   region: process.env.AWS_REGION
});

const mp4FileName = '5MB.mp4';
const bucketName = process.env.S3_BUCKET_NAME;
const hlsFolder = 'hls';



const s3ToS3 = async () => {
    console.log('Starting script');
    console.time('req_time_start'); // Unique label for start time

    try {
        console.log('Downloading S3 MP4 file locally');
        const mp4FilePath = mp4FileName;
        const writeStream = fs.createWriteStream('local.mp4');
        const readStream = s3.getObject({ Bucket: bucketName, Key: mp4FilePath }).createReadStream();
        readStream.pipe(writeStream);
        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
        console.log('Downloaded S3 MP4 file locally');

        // Process resolutions and convert video to HLS
        const resolutions = [
            { resolution: '320x180', videoBitrate: '500k', audioBitrate: '64k' },
            { resolution: '854x480', videoBitrate: '1000k', audioBitrate: '128k' },
            { resolution: '1280x720', videoBitrate: '2500k', audioBitrate: '192k' }
        ];

        const variantPlaylists = []; 

        for (const { resolution, videoBitrate, audioBitrate } of resolutions) {
            console.log(`HLS conversion starting for ${resolution}`);
            const outputFileName = `${mp4FileName.replace('.', '_')}_${resolution}.m3u8`;
            const segmentFileName = `${mp4FileName.replace('.', '_')}_${resolution}_%03d.ts`;
            await new Promise((resolve, reject) => {
                ffmpeg('./local.mp4')
                    .outputOptions([
                        `-c:v h264`,
                        `-b:v ${videoBitrate}`,
                        `-c:a aac`,
                        `-b:a ${audioBitrate}`,
                        `-vf scale=${resolution}`,
                        `-f hls`,
                        `-hls_time 10`,
                        `-hls_list_size 0`,
                        `-hls_segment_filename hls/${segmentFileName}`
                    ])
                    .output(`hls/${outputFileName}`)
                    .on('end', () => resolve())
                    .on('error', (err) => reject(err))
                    .run();
            });
            const variantPlaylist = { resolution, outputFileName };
            variantPlaylists.push(variantPlaylist);
            console.log(`HLS conversion done for ${resolution}`);
        }

        console.log('HLS master m3u8 playlist generating');
        let masterPlaylist = variantPlaylists
            .map(({ resolution, outputFileName }) => {
                const bandwidth = resolution === '320x180'
                    ? 676800
                    : resolution === '854x480'
                    ? 1353600
                    : 3230400;
                return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n${outputFileName}`;
            })
            .join('\n');
        masterPlaylist = `#EXTM3U\n` + masterPlaylist;

        const masterPlaylistFileName = `${mp4FileName.replace('.', '_')}_master.m3u8`;
        const masterPlaylistPath = `hls/${masterPlaylistFileName}`;
        fs.writeFileSync(masterPlaylistPath, masterPlaylist);
        console.log('HLS master m3u8 playlist generated');

        console.log('Deleting locally downloaded S3 MP4 file');
        fs.unlinkSync('local.mp4');
        console.log('Deleted locally downloaded S3 MP4 file');

        console.log('Uploading media m3u8 playlists and ts segments to S3');
        const files = fs.readdirSync(hlsFolder);
        for (const file of files) {
            if (!file.startsWith(mp4FileName.replace('.', '_'))) {
                continue;
            }
            const filePath = path.join(hlsFolder, file);
            const fileStream = fs.createReadStream(filePath);
            const uploadParams = {
                Bucket: bucketName,
                Key: `${hlsFolder}/${file}`,
                Body: fileStream,
                ContentType: file.endsWith('.ts')
                    ? 'video/mp2t'
                    : file.endsWith('.m3u8')
                    ? 'application/x-mpegURL'
                    : null
            };
            await s3.upload(uploadParams).promise();
            fs.unlinkSync(filePath);
        }
        console.log('Uploaded media m3u8 playlists and ts segments to S3. Also deleted locally');

        console.log('Success. Time taken: ');
        console.timeEnd('req_time_start'); // Unique label for end time
    } catch (error) {
        console.error('Error:', error);
    }
};

export default s3ToS3;

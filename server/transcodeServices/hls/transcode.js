
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import fs from "fs";
import path from "path";

ffmpeg.setFfmpegPath(ffmpegStatic);

const convertToHLS = async () => {
    const resolutions = [
        {
            resolution: '320x180',
            videoBitrate: '500k',
            audioBitrate: '64k',
        },
        {
            resolution: '854x480',
            videoBitrate: '1000k',
            audioBitrate: '128k',
        },
        {
            resolution: '1280x720',
            videoBitrate: '2500k',
            audioBitrate: '192k',
        },
    ];

    const mp4FileName = './50MB.mp4';
    const outputDir = path.resolve('output');

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Define baseFileName outside the loop
    const baseFileName = path.basename(mp4FileName, path.extname(mp4FileName));

    const variantPlaylists = [];

    for (const { resolution, videoBitrate, audioBitrate } of resolutions) {
        console.log(`HLS conversion starting for ${resolution}`);

        const outputFileName = `${baseFileName}_${resolution}.m3u8`;
        const segmentFileName = `${baseFileName}_${resolution}_%03d.ts`;

        await new Promise((resolve, reject) => {
            ffmpeg(mp4FileName)
                .outputOptions([
                    `-c:v h264`,
                    `-b:v ${videoBitrate}`,
                    `-c:a aac`,
                    `-b:a ${audioBitrate}`,
                    `-vf scale=${resolution}`,
                    `-f hls`,
                    `-hls_time 10`,   // 10 sec chunk
                    `-hls_list_size 0`,
                    `-hls_segment_filename ${path.join(outputDir, segmentFileName)}`,
                ])
                .output(path.join(outputDir, outputFileName))
                .on('end', () => resolve())
                .on('error', (err) => reject(err))
                .run();
        });

        variantPlaylists.push({
            resolution,
            outputFileName,
        });

        console.log(`HLS conversion done for ${resolution}`);
    }

    console.log(`HLS master m3u8 playlist generating`);

    let masterPlaylist = variantPlaylists
        .map(({ resolution, outputFileName }) => {
            const bandwidth =
                resolution === '320x180'
                    ? 676800
                    : resolution === '854x480'
                    ? 1353600
                    : 3230400;
            return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n${outputFileName}`;
        })
        .join('\n');

    masterPlaylist = `#EXTM3U\n${masterPlaylist}`;

    const masterPlaylistFileName = `${baseFileName}_master.m3u8`;
    const masterPlaylistPath = path.join(outputDir, masterPlaylistFileName);

    fs.writeFileSync(masterPlaylistPath, masterPlaylist);

    console.log(`HLS master m3u8 playlist generated`);
};

export default convertToHLS;


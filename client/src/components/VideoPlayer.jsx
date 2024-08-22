
import ReactPlayer from 'react-player';

const VideoPlayer = () => {
   
    const videoUrl = "https://hlsd-bucket-test.s3.ap-southeast-2.amazonaws.com/transcode+output/output/50MB_master.m3u8"

    // Check if the browser supports HLS
    const isHlsSupported = ReactPlayer.canPlay(videoUrl);

    return (
        <div style={{ maxWidth: '100%', maxHeight: '100%' }}>
            {isHlsSupported ? (
                <ReactPlayer 
                    url={videoUrl} 
                    controls 
                    width="100%" 
                    height="auto" 
                    playing 
                />
            ) : (
                <p>Sorry!!! HLS is not supported in this browser.</p>
            )}
        </div>
    );
};

export default VideoPlayer;




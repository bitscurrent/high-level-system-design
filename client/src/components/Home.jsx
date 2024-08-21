import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getVideos = async () => {
            try {
                const response = await axios.get("http://localhost:5600/api/v1/home");
                setVideos(response.data); // Assuming the response contains an array of video data
                console.log(response, "RESPONSE")
            } catch (error) {
                console.error("Error fetching videos:", error);
            } finally {
                setLoading(false);
            }
        };

        getVideos();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {videos.length > 0 ? (
                videos.map((video, index) => (
                    <div key={index} style={{ flex: '1 1 300px', marginBottom: '20px' }}>
                        <h3>{video.title}</h3>
                        <p>{video.description}</p>
                        <ReactPlayer url={video.url} controls width="100%" />
                    </div>
                ))
            ) : (
                <p>No videos available.</p>
            )}
        </div>
    );
}

export default Home;

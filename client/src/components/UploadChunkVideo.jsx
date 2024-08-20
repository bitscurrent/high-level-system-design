
import { useState } from 'react';
import axios from 'axios';
import styles from './UploadChunkVideo.module.css';

const UploadChunkVideo = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [progress, setProgress] = useState(0);

    const chunkSize = 0.5 * 1024 * 1024; // 0.5MB per chunk

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setError('');
        setSuccess('');
    };

    const uploadChunk = async (chunk, chunkIndex, totalChunks, fileName) => {
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('chunkIndex', chunkIndex);
        formData.append('totalChunks', totalChunks);
        formData.append('fileName', fileName);

        try {
            const response = await axios.post('http://localhost:5600/api/v1/upload/chunk-video', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(`Chunk ${chunkIndex + 1}/${totalChunks} uploaded successfully`, response.data);
            return true;
        } catch (error) {
            console.error('Error uploading chunk:', error);
            setError('Error uploading file. Please try again.');
            return false;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            setError('No file selected');
            return;
        }

        setUploading(true);
        setError('');
        setSuccess('');

        const totalChunks = Math.ceil(selectedFile.size / chunkSize);
        let start = 0;

        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            const chunk = selectedFile.slice(start, start + chunkSize);
            start += chunkSize;

            const isSuccess = await uploadChunk(chunk, chunkIndex, totalChunks, selectedFile.name);
            if (!isSuccess) {
                setUploading(false);
                return;
            }

            setProgress(((chunkIndex + 1) / totalChunks) * 100);
        }

        setUploading(false);
        setSuccess('File uploaded successfully!');
        setSelectedFile(null);
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                    accept="video/*"
                />
                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}
                {uploading && <p className={styles.progress}>Uploading... {progress.toFixed(2)}%</p>}
                <button
                    type="submit"
                    className={styles.uploadButton}
                    disabled={!selectedFile || uploading}
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
        </div>
    );
};

export default UploadChunkVideo;

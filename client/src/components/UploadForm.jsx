

import { useState } from 'react';
import axios from 'axios';
import styles from './UploadForm.module.css';

const UploadChunkVideo = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type (e.g., video)
            const validTypes = ['video/mp4', 'video/mov', 'video/avi'];
            if (!validTypes.includes(file.type)) {
                setError('Invalid file type. Please select a video file.');
                setSelectedFile(null);
                return;
            }

            // Validate file size (e.g., max 50MB)
            const maxSize = 50 * 1024 * 1024; // 50MB
            if (file.size > maxSize) {
                setError('File size exceeds the limit of 50MB.');
                setSelectedFile(null);
                return;
            }

            setError('');
            setSelectedFile(file);
            setProgress(0);
            setSuccess('');
        }
    };

    const handleFileUpload = async (file) => {
        const chunkSize = 0.5 * 1024 * 1024; // 0.5MB chunk size
        const totalChunks = Math.ceil(file.size / chunkSize);
        let start = 0;

        setUploading(true);

        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            const chunk = file.slice(start, start + chunkSize);
            start += chunkSize;

            const formData = new FormData();
            formData.append('filename', file.name);
            formData.append('chunk', chunk);
            formData.append('chunkIndex', chunkIndex);
            formData.append('totalChunks', totalChunks);

            console.log(`Uploading chunk ${chunkIndex + 1} of ${totalChunks}`);

            try {
                const res = await axios.post('http://localhost:5600/api/v1/upload/chunk-video', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log(res.data);

                // Update progress
                setProgress(((chunkIndex + 1) / totalChunks) * 100);
            } catch (error) {
                console.error('Error uploading chunk:', error);
                setError('Error uploading file. Please try again.');
                setUploading(false);
                return; // Exit if an error occurs
            }
        }

        setUploading(false);
        setSelectedFile(null); // Clear the file input after upload
        setSuccess('File uploaded successfully!');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!selectedFile) {
            setError('No file selected');
            return;
        }
        handleFileUpload(selectedFile);
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
                {uploading && <p>Progress: {progress.toFixed(2)}%</p>}
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

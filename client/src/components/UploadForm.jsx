
import { useState } from 'react';
import axios from 'axios';
import styles from './UploadForm.module.css';

const UploadVideo = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
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
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            setError('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile); // Updated key to 'file'

        setUploading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:5600/api/v1/upload/video', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess('File uploaded successfully!');
            console.log(response.data);
        } catch (error) {
            setError('Error uploading file. Please try again.');
            console.error('Error uploading file:', error);
        } finally {
            setUploading(false);
        }
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

export default UploadVideo;

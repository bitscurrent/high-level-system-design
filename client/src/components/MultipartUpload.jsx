
import  { useState } from 'react';
import axios from 'axios';


const UploadForm = () => {
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {

    // Zod and express validation can be added later.
    if (!title || !author) {
      alert('Title and Author are required fields.');
      return;
    }

    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    try {
      // Step 1: Initialize the upload (this will add info such as filename)
      const formData = new FormData();
      formData.append('filename', selectedFile.name);

      const initializeRes = await axios.post('http://localhost:5600/api/v1/upload/initialize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { uploadId } = initializeRes.data;
      console.log('Upload ID:', uploadId);

      // Step 2: Upload the file in chunks
      const chunkSize = 5 * 1024 * 1024; // 5 MB chunks
      const totalChunks = Math.ceil(selectedFile.size / chunkSize);
      const uploadPromises = [];

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * chunkSize;
        const chunk = selectedFile.slice(start, start + chunkSize);

        const chunkFormData = new FormData();
        chunkFormData.append('filename', selectedFile.name);
        chunkFormData.append('chunk', chunk);
        chunkFormData.append('totalChunks', totalChunks);
        chunkFormData.append('chunkIndex', chunkIndex);
        chunkFormData.append('uploadId', uploadId);

        const uploadPromise = axios.post('http://localhost:5600/api/v1/upload/', chunkFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        uploadPromises.push(uploadPromise);
      }

      await Promise.all(uploadPromises);

      // Step 3: Complete the upload
      const completeRes = await axios.post('http://localhost:5600/api/v1/upload/complete', {
        filename: selectedFile.name,
        totalChunks: totalChunks,
        uploadId: uploadId,
        title: title,
        description: description,
        author: author
      });

      console.log('Upload complete:', completeRes.data);

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="container mx-auto max-w-lg p-10">
      <form>
        <div className="mb-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="px-3 py-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-3 py-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="px-3 py-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="px-3 py-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={handleUpload}
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadForm;

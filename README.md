# high-level-system-design


# Project Overview: High-Level System Design

### React + NodeJS
- Both client-side and backend operations run with command: `npm run dev`. by visiting their root locations.

### Requirements
- AWS S3 account for storage.

### Agenda
1. **Chunking Large Files**: Efficiently upload large video files to S3 by dividing them into smaller chunks.
2. **Transcoding**: Adjust video resolution to fit different devices. Automatically shift to a lower resolution if network conditions degrade.

### Procedure

1. **Initial Setup:**
   - Create an `api/upload` route that is hardcoded to push small video files to S3.
   - Ensure that the route can accept files from `req.file` sent via `body > form-data`.

2. **Frontend Integration:**
   - Code the frontend to allow users to upload video files from the client side.
   - A mechanism to post video files from the client to the `api/upload` route.

3. **Chunking Implementation:**
   - Modify the `api/upload` route to handle large video files by chunking them.
   - Accept video files from the client, divide them into chunks, and upload each chunk sequentially to S3.

4. **Transcoding & Adaptive Streaming using (HLS):**
   - Set up a transcoding service to adjust video resolution based on device capability.
   - Implement adaptive streaming to shift to a lower resolution when network conditions are poor.

5. **Google OAuth Integration:**
   - Implement OAuth for user authentication, enabling Google sign-in and sign-out. (to be added...)

6. **Kafka Integration:**
   - Use Kafka to manage video processing, such as filtering explicit content or handling notifications related to the video upload process.

7. **Final Touches:**
   - Testing and optimization of all features.
   - Deployment of the application.


import axios from 'axios';
import fs from 'fs';

const TIKTOK_API_BASE = 'https://open.tiktokapis.com/v1';

interface TikTokUploadResponse {
  data: {
    upload_id: string;
  };
}

interface TikTokPublishResponse {
  data: {
    video_id: string;
  };
}

export async function initializeTikTokUpload(
  accessToken: string,
  videoSize: number
): Promise<string> {
  try {
    const response = await axios.post<TikTokUploadResponse>(
      `${TIKTOK_API_BASE}/video/upload/init/`,
      {
        source_info: {
          source: 'FILE_UPLOAD',
          video_size: videoSize,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data.upload_id;
  } catch (error) {
    console.error('TikTok upload initialization error:', error);
    throw new Error('Failed to initialize TikTok upload');
  }
}

export async function uploadTikTokVideo(
  accessToken: string,
  uploadId: string,
  videoBuffer: Buffer,
  chunkSize: number = 5242880 // 5MB chunks
): Promise<void> {
  try {
    const totalChunks = Math.ceil(videoBuffer.length / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, videoBuffer.length);
      const chunk = videoBuffer.slice(start, end);

      const formData = new FormData();
      formData.append('upload_id', uploadId);
      formData.append('chunk_index', i.toString());
      formData.append('total_chunk_count', totalChunks.toString());
      formData.append('chunk', new Blob([chunk]), 'chunk');

      await axios.post(
        `${TIKTOK_API_BASE}/video/upload/parts/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    }
  } catch (error) {
    console.error('TikTok video upload error:', error);
    throw new Error('Failed to upload video to TikTok');
  }
}

export async function publishTikTokVideo(
  accessToken: string,
  uploadId: string,
  title: string,
  description: string
): Promise<string> {
  try {
    const response = await axios.post<TikTokPublishResponse>(
      `${TIKTOK_API_BASE}/video/publish/`,
      {
        source_info: {
          source: 'FILE_UPLOAD',
          upload_id: uploadId,
        },
        post_info: {
          title: title,
          description: description,
          privacy_level: 'PUBLIC_TO_EVERYONE',
          comment_disabled: false,
          duet_disabled: false,
          stitch_disabled: false,
          share_disabled: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data.video_id;
  } catch (error) {
    console.error('TikTok video publish error:', error);
    throw new Error('Failed to publish video to TikTok');
  }
}

export async function publishToTikTok(
  accessToken: string,
  videoBuffer: Buffer,
  title: string,
  description: string
): Promise<string> {
  try {
    // Étape 1: Initialiser l'upload
    const uploadId = await initializeTikTokUpload(accessToken, videoBuffer.length);

    // Étape 2: Uploader le fichier vidéo
    await uploadTikTokVideo(accessToken, uploadId, videoBuffer);

    // Étape 3: Publier la vidéo
    const videoId = await publishTikTokVideo(accessToken, uploadId, title, description);

    return videoId;
  } catch (error) {
    console.error('TikTok publishing error:', error);
    throw error;
  }
}

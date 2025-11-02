import axios from 'axios';
import fs from 'fs';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const YOUTUBE_UPLOAD_URL = 'https://www.googleapis.com/upload/youtube/v3/videos';

interface YouTubeUploadResponse {
  id: string;
  snippet: {
    title: string;
    description: string;
  };
}

export async function publishToYouTube(
  accessToken: string,
  videoBuffer: Buffer,
  title: string,
  description: string,
  tags: string[] = []
): Promise<string> {
  try {
    // Préparer les métadonnées de la vidéo
    const metadata = {
      snippet: {
        title: title,
        description: description,
        tags: tags,
        categoryId: '22', // People & Blogs
      },
      status: {
        privacyStatus: 'public',
        selfDeclaredMadeForKids: false,
      },
    };

    // Créer une requête multipart pour l'upload resumable
    const response = await axios.post<YouTubeUploadResponse>(
      YOUTUBE_UPLOAD_URL,
      videoBuffer,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Goog-Upload-Protocol': 'resumable',
          'X-Goog-Upload-Command': 'start',
          'X-Goog-Upload-Header-Content-Length': videoBuffer.length.toString(),
          'Content-Type': 'application/json',
        },
        params: {
          uploadType: 'resumable',
          part: 'snippet,status',
        },
        data: JSON.stringify(metadata),
      }
    );

    // Récupérer l'URL de session d'upload
    const sessionUri = response.headers['location'];

    if (!sessionUri) {
      throw new Error('No upload session URI returned');
    }

    // Uploader le fichier vidéo
    const uploadResponse = await axios.put<YouTubeUploadResponse>(
      sessionUri,
      videoBuffer,
      {
        headers: {
          'Content-Type': 'video/mp4',
          'X-Goog-Upload-Command': 'upload, finalize',
          'X-Goog-Upload-Offset': '0',
        },
      }
    );

    return uploadResponse.data.id;
  } catch (error) {
    console.error('YouTube publishing error:', error);
    throw new Error('Failed to publish video to YouTube');
  }
}

export async function getYouTubeVideoStatus(
  accessToken: string,
  videoId: string
): Promise<{
  id: string;
  status: string;
  uploadStatus: string;
  processingStatus: string;
}> {
  try {
    const response = await axios.get(
      `${YOUTUBE_API_BASE}/videos`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          id: videoId,
          part: 'status,processingDetails',
        },
      }
    );

    const video = response.data.items[0];

    return {
      id: video.id,
      status: video.status.uploadStatus,
      uploadStatus: video.status.uploadStatus,
      processingStatus: video.processingDetails?.processingStatus || 'UNKNOWN',
    };
  } catch (error) {
    console.error('YouTube status check error:', error);
    throw new Error('Failed to check YouTube video status');
  }
}

export async function updateYouTubeVideo(
  accessToken: string,
  videoId: string,
  title: string,
  description: string,
  tags: string[] = []
): Promise<void> {
  try {
    await axios.put(
      `${YOUTUBE_API_BASE}/videos`,
      {
        id: videoId,
        snippet: {
          title: title,
          description: description,
          tags: tags,
          categoryId: '22',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          part: 'snippet',
        },
      }
    );
  } catch (error) {
    console.error('YouTube video update error:', error);
    throw new Error('Failed to update YouTube video');
  }
}

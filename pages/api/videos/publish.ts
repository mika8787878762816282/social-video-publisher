import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import formidable from 'formidable';
import fs from 'fs';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const form = formidable({ multiples: false });
    const [fields, files] = await form.parse(req);

    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    const platformsStr = Array.isArray(fields.platforms) ? fields.platforms[0] : fields.platforms;
    const platforms = JSON.parse(platformsStr || '{}');
    const videoFile = Array.isArray(files.video) ? files.video[0] : files.video;

    if (!videoFile) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    // Lire le fichier vidéo
    const videoBuffer = fs.readFileSync(videoFile.filepath);

    // Publier sur TikTok si sélectionné
    if (platforms.tiktok) {
      try {
        await publishToTikTok(videoBuffer, title, description, session);
      } catch (error) {
        console.error('TikTok publishing error:', error);
      }
    }

    // Publier sur YouTube si sélectionné
    if (platforms.youtube) {
      try {
        await publishToYouTube(videoBuffer, title, description, session);
      } catch (error) {
        console.error('YouTube publishing error:', error);
      }
    }

    // Nettoyer le fichier temporaire
    fs.unlinkSync(videoFile.filepath);

    return res.status(200).json({
      success: true,
      message: 'Video published successfully',
      platforms: platforms,
    });
  } catch (error) {
    console.error('Publishing error:', error);
    return res.status(500).json({
      error: 'Failed to publish video',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

async function publishToTikTok(
  videoBuffer: Buffer,
  title: string,
  description: string,
  session: any
) {
  // Implémentation de la publication TikTok
  console.log('Publishing to TikTok:', title);
  
  // TODO: Implémenter l'intégration TikTok Content Posting API
  // Étapes:
  // 1. Initialiser l'upload
  // 2. Uploader le fichier vidéo
  // 3. Publier la vidéo
}

async function publishToYouTube(
  videoBuffer: Buffer,
  title: string,
  description: string,
  session: any
) {
  // Implémentation de la publication YouTube
  console.log('Publishing to YouTube:', title);
  
  // TODO: Implémenter l'intégration YouTube Data API v3
  // Étapes:
  // 1. Initialiser l'upload resumable
  // 2. Uploader le fichier vidéo
  // 3. Publier la vidéo
}

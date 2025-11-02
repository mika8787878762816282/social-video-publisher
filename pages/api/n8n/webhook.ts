import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { videoUrl, title, description, platforms } = req.body;

      // Valider les données
      if (!videoUrl || !title) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Traiter la publication
      // TODO: Implémenter la logique de publication pour chaque plateforme
      
      return res.status(200).json({
        success: true,
        message: 'Video queued for publishing',
        data: {
          videoUrl,
          title,
          description,
          platforms,
        },
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to process webhook',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  } else if (req.method === 'GET') {
    // Endpoint pour tester la connexion n8n
    return res.status(200).json({
      status: 'ok',
      message: 'n8n webhook endpoint is working',
    });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

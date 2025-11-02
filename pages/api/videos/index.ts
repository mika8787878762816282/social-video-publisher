import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const { status = 'all' } = req.query;

      // TODO: Récupérer les vidéos de la base de données
      // Pour l'instant, retourner un tableau vide
      const videos = [];

      return res.status(200).json({
        success: true,
        videos: videos,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to fetch videos',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

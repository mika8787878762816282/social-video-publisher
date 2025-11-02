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
      // TODO: Récupérer les paramètres de l'utilisateur depuis la base de données
      const socialAccounts = [
        { platform: 'TikTok', connected: false },
        { platform: 'YouTube', connected: false },
        { platform: 'LinkedIn', connected: false },
        { platform: 'Twitter', connected: false },
      ];

      return res.status(200).json({
        success: true,
        socialAccounts,
        n8nWebhook: null,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to fetch settings',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

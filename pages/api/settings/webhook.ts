import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { validateN8nWebhookUrl, testN8nWebhook } from '../../../lib/n8n';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { webhookUrl } = req.body;

      // Valider l'URL
      if (!webhookUrl || !validateN8nWebhookUrl(webhookUrl)) {
        return res.status(400).json({ error: 'Invalid webhook URL' });
      }

      // Tester le webhook
      const isValid = await testN8nWebhook(webhookUrl);
      if (!isValid) {
        return res.status(400).json({ error: 'Webhook URL is not reachable' });
      }

      // TODO: Sauvegarder le webhook dans la base de données
      const webhook = {
        id: 'webhook_' + Date.now(),
        webhookUrl: webhookUrl,
        active: true,
      };

      return res.status(200).json({
        success: true,
        webhook: webhook,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to save webhook',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      // TODO: Supprimer le webhook de la base de données
      return res.status(200).json({
        success: true,
        message: 'Webhook deleted',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to delete webhook',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

import axios from 'axios';

interface N8nWebhookPayload {
  videoUrl: string;
  title: string;
  description: string;
  platforms: string[];
  userId?: string;
  metadata?: Record<string, any>;
}

interface N8nWebhookResponse {
  success: boolean;
  message: string;
  data?: any;
}

export async function sendToN8nWebhook(
  webhookUrl: string,
  payload: N8nWebhookPayload
): Promise<N8nWebhookResponse> {
  try {
    const response = await axios.post<N8nWebhookResponse>(
      webhookUrl,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 seconds timeout
      }
    );

    return response.data;
  } catch (error) {
    console.error('n8n webhook error:', error);
    throw new Error('Failed to send webhook to n8n');
  }
}

export async function triggerN8nWorkflow(
  webhookUrl: string,
  videoData: {
    title: string;
    description: string;
    videoUrl: string;
    platforms: string[];
  }
): Promise<void> {
  try {
    const payload: N8nWebhookPayload = {
      videoUrl: videoData.videoUrl,
      title: videoData.title,
      description: videoData.description,
      platforms: videoData.platforms,
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'social-video-publisher',
      },
    };

    const response = await sendToN8nWebhook(webhookUrl, payload);

    if (!response.success) {
      throw new Error(response.message || 'n8n workflow failed');
    }

    console.log('n8n workflow triggered successfully:', response.data);
  } catch (error) {
    console.error('n8n workflow trigger error:', error);
    throw error;
  }
}

export function validateN8nWebhookUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function testN8nWebhook(webhookUrl: string): Promise<boolean> {
  try {
    const response = await axios.post(
      webhookUrl,
      {
        test: true,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      }
    );

    return response.status === 200;
  } catch (error) {
    console.error('n8n webhook test error:', error);
    return false;
  }
}

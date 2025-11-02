import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from '../styles/Settings.module.css';

interface SocialAccount {
  platform: string;
  connected: boolean;
  accountId?: string;
}

interface N8nWebhook {
  id: string;
  webhookUrl: string;
  active: boolean;
}

export default function Settings() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    { platform: 'TikTok', connected: false },
    { platform: 'YouTube', connected: false },
    { platform: 'LinkedIn', connected: false },
    { platform: 'Twitter', connected: false },
  ]);
  const [n8nWebhook, setN8nWebhook] = useState<N8nWebhook | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!mounted || !session) {
      return;
    }

    fetchSettings();
  }, [session, mounted]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSocialAccounts(data.socialAccounts || socialAccounts);
        setN8nWebhook(data.n8nWebhook || null);
        setWebhookUrl(data.n8nWebhook?.webhookUrl || '');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleConnectPlatform = async (platform: string) => {
    // TODO: Implémenter la connexion aux plateformes sociales
    setMessage(`Connexion à ${platform} en cours...`);
  };

  const handleSaveWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/settings/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ webhookUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        setN8nWebhook(data.webhook);
        setMessage('Webhook n8n configuré avec succès!');
      } else {
        setMessage('Erreur lors de la configuration du webhook');
      }
    } catch (error) {
      setMessage('Erreur: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h1>Paramètres</h1>

      <div className={styles.section}>
        <h2>Comptes sociaux</h2>
        <p>Connectez vos comptes pour publier directement sur les plateformes</p>
        
        <div className={styles.accountsList}>
          {socialAccounts.map(account => (
            <div key={account.platform} className={styles.accountItem}>
              <div className={styles.accountInfo}>
                <h3>{account.platform}</h3>
                {account.connected ? (
                  <p className={styles.connected}>Connecté - {account.accountId}</p>
                ) : (
                  <p className={styles.notConnected}>Non connecté</p>
                )}
              </div>
              <button
                onClick={() => handleConnectPlatform(account.platform)}
                className={account.connected ? styles.disconnectButton : styles.connectButton}
              >
                {account.connected ? 'Déconnecter' : 'Connecter'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Intégration n8n</h2>
        <p>Configurez un webhook n8n pour automatiser vos publications</p>

        <form onSubmit={handleSaveWebhook} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="webhook">URL du webhook n8n</label>
            <input
              type="url"
              id="webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-n8n-instance.com/webhook/..."
              required
            />
          </div>

          {message && <p className={styles.message}>{message}</p>}

          <button type="submit" disabled={loading} className={styles.saveButton}>
            {loading ? 'Sauvegarde en cours...' : 'Sauvegarder'}
          </button>
        </form>

        {n8nWebhook && (
          <div className={styles.webhookInfo}>
            <p>Webhook configuré avec succès</p>
            <p className={styles.webhookUrl}>{n8nWebhook.webhookUrl}</p>
            <p className={styles.webhookStatus}>
              État: {n8nWebhook.active ? 'Actif' : 'Inactif'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

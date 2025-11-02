import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Dashboard.module.css';

interface Video {
  id: string;
  title: string;
  description: string;
  status: string;
  platforms: string[];
  publishedAt: string;
  platformUrl?: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!session) {
      router.push('/');
      return;
    }

    fetchVideos();
  }, [session, filter]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/videos?status=${filter}`);
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos || []);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !session) {
    return null;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Tableau de bord</h1>
        <Link href="/publish">
          <button className={styles.publishButton}>
            Publier une vidéo
          </button>
        </Link>
      </header>

      <div className={styles.filters}>
        <button
          className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          Toutes les vidéos
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'published' ? styles.active : ''}`}
          onClick={() => setFilter('published')}
        >
          Publiées
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'draft' ? styles.active : ''}`}
          onClick={() => setFilter('draft')}
        >
          Brouillons
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'failed' ? styles.active : ''}`}
          onClick={() => setFilter('failed')}
        >
          Erreurs
        </button>
      </div>

      <div className={styles.content}>
        {loading ? (
          <p className={styles.loading}>Chargement...</p>
        ) : videos.length === 0 ? (
          <div className={styles.empty}>
            <p>Aucune vidéo trouvée</p>
            <Link href="/publish">
              <button className={styles.primaryButton}>
                Publier votre première vidéo
              </button>
            </Link>
          </div>
        ) : (
          <div className={styles.videoGrid}>
            {videos.map(video => (
              <div key={video.id} className={styles.videoCard}>
                <div className={styles.videoHeader}>
                  <h3>{video.title}</h3>
                  <span className={`${styles.status} ${styles[video.status]}`}>
                    {video.status}
                  </span>
                </div>
                <p className={styles.description}>{video.description}</p>
                <div className={styles.platforms}>
                  {video.platforms.map(platform => (
                    <span key={platform} className={styles.platform}>
                      {platform}
                    </span>
                  ))}
                </div>
                <div className={styles.footer}>
                  <small>{new Date(video.publishedAt).toLocaleDateString()}</small>
                  {video.platformUrl && (
                    <a href={video.platformUrl} target="_blank" rel="noopener noreferrer">
                      Voir la vidéo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

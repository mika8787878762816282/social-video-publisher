import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from '../styles/Publish.module.css';

export default function Publish() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platforms: {
      tiktok: false,
      youtube: false,
      linkedin: false,
      twitter: false,
    },
    videoFile: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!mounted || !session) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlatformChange = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: !prev.platforms[platform as keyof typeof prev.platforms],
      },
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        videoFile: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('platforms', JSON.stringify(formData.platforms));
      if (formData.videoFile) {
        formDataToSend.append('video', formData.videoFile);
      }

      const response = await fetch('/api/videos/publish', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setMessage('Vidéo publiée avec succès!');
        setFormData({
          title: '',
          description: '',
          platforms: {
            tiktok: false,
            youtube: false,
            linkedin: false,
            twitter: false,
          },
          videoFile: null,
        });
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        setMessage('Erreur lors de la publication');
      }
    } catch (error) {
      setMessage('Erreur: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Publier une vidéo</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Titre de la vidéo *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Entrez le titre de votre vidéo"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Entrez la description de votre vidéo"
            rows={4}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="video">Fichier vidéo *</label>
          <input
            type="file"
            id="video"
            name="video"
            onChange={handleFileChange}
            accept="video/*"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Plateformes de destination *</label>
          <div className={styles.platformCheckboxes}>
            {Object.keys(formData.platforms).map(platform => (
              <label key={platform} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={formData.platforms[platform as keyof typeof formData.platforms]}
                  onChange={() => handlePlatformChange(platform)}
                />
                <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {message && <p className={styles.message}>{message}</p>}

        <button 
          type="submit" 
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? 'Publication en cours...' : 'Publier la vidéo'}
        </button>
      </form>
    </div>
  );
}

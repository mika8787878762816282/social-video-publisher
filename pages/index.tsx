import React, { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Social Video Publisher</h1>
        <p>Publiez vos vidéos sur TikTok, YouTube, LinkedIn et Twitter</p>
      </header>

      <main className={styles.main}>
        {!session ? (
          <div className={styles.authSection}>
            <h2>Bienvenue</h2>
            <p>Connectez-vous avec Google pour commencer à publier vos vidéos</p>
            <button 
              onClick={() => signIn('google')}
              className={styles.loginButton}
            >
              Se connecter avec Google
            </button>
          </div>
        ) : (
          <div className={styles.dashboardSection}>
            <h2>Bienvenue, {session.user?.name}!</h2>
            <div className={styles.userInfo}>
              {session.user?.image && (
                <img src={session.user.image} alt="Profile" className={styles.avatar} />
              )}
              <p>Email: {session.user?.email}</p>
            </div>

            <div className={styles.actionButtons}>
              <Link href="/publish">
                <button className={styles.primaryButton}>
                  Publier une vidéo
                </button>
              </Link>
              <Link href="/dashboard">
                <button className={styles.secondaryButton}>
                  Tableau de bord
                </button>
              </Link>
              <Link href="/settings">
                <button className={styles.secondaryButton}>
                  Paramètres
                </button>
              </Link>
            </div>

            <button 
              onClick={() => signOut()}
              className={styles.logoutButton}
            >
              Se déconnecter
            </button>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 Social Video Publisher. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

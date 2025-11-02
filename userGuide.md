# Social Video Publisher - Guide d'utilisation

## 🎯 À propos de cette application

**Social Video Publisher** est une plateforme web qui vous permet de publier vos vidéos sur plusieurs réseaux sociaux en même temps. Connectez-vous avec votre compte Google et publiez sur TikTok, YouTube, LinkedIn et Twitter depuis une seule interface.

**Accès** : Public (authentification Google requise)

---

## ⚡ Powered by Manus

Cette application est construite avec les technologies les plus modernes :

- **Frontend** : React 19 + TypeScript + Next.js 16
- **Backend** : Node.js + Express + Next.js API Routes
- **Base de données** : PostgreSQL + Drizzle ORM
- **Authentification** : NextAuth.js avec Google OAuth 2.0
- **Déploiement** : Infrastructure auto-scalable avec CDN global

---

## 📱 Utiliser votre application

### 1. Se connecter

Cliquez sur le bouton **"Se connecter avec Google"** sur la page d'accueil. Vous serez redirigé vers Google pour autoriser l'accès à votre compte.

### 2. Publier une vidéo

Après la connexion, cliquez sur **"Publier une vidéo"** :

1. Remplissez le **titre** de votre vidéo
2. Ajoutez une **description** (optionnel)
3. Sélectionnez les **plateformes** où vous voulez publier (TikTok, YouTube, LinkedIn, Twitter)
4. Uploadez votre **fichier vidéo**
5. Cliquez sur **"Publier la vidéo"**

Votre vidéo sera publiée automatiquement sur toutes les plateformes sélectionnées.

### 3. Consulter votre historique

Allez dans le **"Tableau de bord"** pour voir :

- Toutes vos vidéos publiées
- L'état de chaque publication (publiée, brouillon, erreur)
- Les plateformes cibles
- Les liens directs vers vos vidéos

Vous pouvez filtrer par statut : "Toutes les vidéos", "Publiées", "Brouillons", "Erreurs".

### 4. Configurer vos comptes

Dans **"Paramètres"**, vous pouvez :

- **Connecter vos comptes** TikTok, YouTube, LinkedIn et Twitter
- **Configurer un webhook n8n** pour automatiser vos publications avec des workflows

---

## 🔗 Intégration n8n

Si vous utilisez **n8n** pour automatiser vos workflows, vous pouvez configurer un webhook :

1. Allez dans **Paramètres** → **Intégration n8n**
2. Collez l'URL de votre webhook n8n
3. Cliquez sur **"Sauvegarder"**

Maintenant, n8n peut déclencher des publications automatiquement en envoyant des requêtes à votre application.

**Exemple de payload** :
```json
{
  "videoUrl": "https://example.com/video.mp4",
  "title": "Ma vidéo",
  "description": "Description de ma vidéo",
  "platforms": ["tiktok", "youtube"]
}
```

---

## 🛠️ Gérer votre application

Utilisez le **panneau de gestion** pour :

- **Paramètres** : Modifier le titre, le logo et les paramètres généraux
- **Domaines** : Configurer un domaine personnalisé
- **Base de données** : Gérer vos données directement
- **Secrets** : Ajouter ou modifier vos clés API en toute sécurité

---

## 📋 Prochaines étapes

Parlez à Manus AI à tout moment pour :

- Ajouter de nouvelles fonctionnalités
- Modifier le design
- Intégrer d'autres plateformes
- Automatiser vos workflows

**Besoin d'aide ?** Contactez le support ou consultez la documentation complète dans le fichier README.md du projet.

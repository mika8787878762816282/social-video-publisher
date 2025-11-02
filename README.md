# Social Video Publisher

Une application web permettant aux utilisateurs de se connecter via Google pour publier des vidéos sur TikTok, YouTube, LinkedIn et Twitter.

## Fonctionnalités

- **Authentification Google OAuth 2.0** : Connexion sécurisée via Google
- **Publication multi-plateforme** : Publiez sur TikTok, YouTube, LinkedIn et Twitter
- **Intégration TikTok Content Posting API** : Publication directe sur TikTok
- **Intégration YouTube Data API v3** : Publication sur YouTube
- **API n8n** : Webhooks pour les workflows automatisés
- **Base de données** : Stockage des tokens et des publications
- **Interface intuitive** : Design simple et facile à utiliser

## Installation

### Prérequis

- Node.js 16+
- npm ou pnpm
- PostgreSQL (pour la base de données)

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd social_video_publisher
```

2. **Installer les dépendances**
```bash
npm install
# ou
pnpm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env.local` à la racine du projet :

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# TikTok API
TIKTOK_CLIENT_ID=your-tiktok-client-id
TIKTOK_CLIENT_SECRET=your-tiktok-client-secret

# YouTube API
YOUTUBE_API_KEY=your-youtube-api-key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/social_video_publisher

# API Keys
API_SECRET=your-api-secret-key
```

4. **Configurer la base de données**
```bash
npm run db:generate
npm run db:push
```

5. **Démarrer l'application**
```bash
npm run dev
```

L'application sera accessible à `http://localhost:3000`

## Configuration des APIs

### Google OAuth

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet
3. Activez l'API Google+ 
4. Créez des credentials OAuth 2.0 (Application Web)
5. Ajoutez les URIs autorisées :
   - JavaScript: `http://localhost:3000`
   - Redirection: `http://localhost:3000/api/auth/callback/google`

### TikTok API

1. Allez sur [TikTok for Developers](https://developers.tiktok.com/)
2. Créez une application
3. Activez le Content Posting API
4. Obtenez vos credentials (Client ID et Client Secret)

### YouTube API

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Activez l'API YouTube Data v3
3. Créez une clé API

## Utilisation

### Publier une vidéo

1. Connectez-vous avec votre compte Google
2. Cliquez sur "Publier une vidéo"
3. Remplissez le formulaire :
   - Titre de la vidéo
   - Description
   - Sélectionnez les plateformes cibles
   - Uploadez votre fichier vidéo
4. Cliquez sur "Publier"

### Intégration n8n

L'application expose un endpoint pour les webhooks n8n :

**URL** : `POST /api/n8n/webhook`

**Payload** :
```json
{
  "videoUrl": "https://example.com/video.mp4",
  "title": "Titre de la vidéo",
  "description": "Description de la vidéo",
  "platforms": ["tiktok", "youtube"]
}
```

## Structure du projet

```
social_video_publisher/
├── pages/
│   ├── api/
│   │   ├── auth/[...nextauth].ts    # Authentification NextAuth
│   │   ├── videos/publish.ts        # API de publication
│   │   └── n8n/webhook.ts           # Webhook n8n
│   ├── index.tsx                    # Page d'accueil
│   ├── publish.tsx                  # Page de publication
│   └── dashboard.tsx                # Tableau de bord (à implémenter)
├── db/
│   └── schema.ts                    # Schéma de base de données
├── styles/
│   ├── Home.module.css
│   └── Publish.module.css
├── lib/
│   ├── tiktok.ts                    # Intégration TikTok
│   ├── youtube.ts                   # Intégration YouTube
│   └── n8n.ts                       # Intégration n8n
├── .env.local                       # Variables d'environnement
└── package.json
```

## Développement

### Scripts disponibles

- `npm run dev` : Démarrer le serveur de développement
- `npm run build` : Construire l'application pour la production
- `npm run start` : Démarrer l'application en production
- `npm run db:generate` : Générer les migrations de base de données
- `npm run db:push` : Appliquer les migrations

## Prochaines étapes

- [ ] Implémenter l'intégration TikTok Content Posting API
- [ ] Implémenter l'intégration YouTube Data API v3
- [ ] Ajouter le support de LinkedIn
- [ ] Ajouter le support de Twitter
- [ ] Créer le tableau de bord avec l'historique des publications
- [ ] Ajouter la planification des publications
- [ ] Implémenter les webhooks n8n complets
- [ ] Ajouter les tests unitaires et d'intégration

## Licence

MIT

## Support

Pour toute question ou problème, veuillez créer une issue sur le repository.

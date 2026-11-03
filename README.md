# Portfolio Ghassen SAKKA

Site portfolio professionnel (FR/EN) avec back-office complet, construit avec
Next.js (App Router), TypeScript, Tailwind CSS et Prisma. Base de données
SQLite en local (aucune installation requise), PostgreSQL (Neon) en ligne.

Toutes les commandes ci-dessous sont données pour **Windows / PowerShell**.

---

## 1. Démarrage en local (3 commandes)

Prérequis : [Node.js](https://nodejs.org) 20 ou plus (testé avec Node 24).

```powershell
cd portfolio-ghassen
npm install
npm run setup
npm run dev
```

- `npm install` : installe les dépendances.
- `npm run setup` : crée le fichier `.env` (s'il n'existe pas déjà), génère un
  secret de session aléatoire, crée la base de données SQLite
  (`data/portfolio.db`) et injecte tout le contenu (profil, expériences,
  projets, certifications, formation, vie associative, etc.) ainsi que le
  compte administrateur. Cette commande est **rejouable sans créer de
  doublons** (idempotente) : si une section contient déjà des données, elle
  n'est pas réinjectée.
- `npm run dev` : démarre le site en local.

Une fois lancé :
- **Site public** : http://localhost:3000 (redirige vers `/fr` ou `/en` selon
  la langue de votre navigateur)
- **Back-office** : http://localhost:3000/admin

> Si le port 3000 est déjà utilisé par un autre programme, Next.js choisit
> automatiquement le port suivant disponible (3001, 3002…) et l'indique dans
> le terminal au démarrage.

### Identifiants admin par défaut (local uniquement)

| Champ | Valeur |
|---|---|
| URL | http://localhost:3000/admin |
| Email | `admin@local.test` |
| Mot de passe | `ChangeMe123!` |

Changez ce mot de passe dès la première connexion depuis **Mon compte** dans
le back-office. Ces valeurs par défaut sont définies dans `.env`
(`ADMIN_EMAIL` / `ADMIN_PASSWORD`) et ne sont utilisées que si aucun compte
admin n'existe encore au moment de `npm run setup`.

---

## 2. Se connecter au back-office et modifier le contenu

1. Ouvrez http://localhost:3000/admin et connectez-vous.
2. Le menu de gauche liste toutes les sections :
   - **Profil / Hero / À propos** : nom, titre, bandeau, texte « à propos »,
     mention partenaire Microsoft, contacts, photo de profil, CV (PDF).
   - **Expériences, Projets, Migration, Certifications, Formation, Rôles
     associatifs, Actions associatives, Distinctions, Sponsors, Centres
     d'intérêt, Liens et réseaux** : CRUD complet (ajouter / modifier /
     supprimer / réordonner avec les flèches ↑↓ / afficher ou masquer avec
     l'icône œil).
   - **Messages de contact** : messages reçus via le formulaire du site,
     marquer lu/non lu, supprimer.
   - **Export / Import** : sauvegarder ou restaurer tout le contenu en JSON.
   - **Mon compte** : changer le mot de passe administrateur.
3. Chaque formulaire de contenu possède deux onglets **Français / English** :
   remplissez chaque champ texte dans les deux langues. Les champs sans
   onglet (ex. date, lien, image) sont communs aux deux langues.
4. Les modifications sont visibles **immédiatement** sur le site public
   (http://localhost:3000/fr et /en) après enregistrement.
5. Les images et le CV sont limités en taille et en type de fichier (voir
   `.env.example`, section stockage) ; un message d'erreur clair s'affiche
   en cas de fichier refusé.

### Section « Migration »

Une section dédiée « Migration » existe (back-office + site public), prête à
l'emploi mais **vide par défaut** : aucun contenu n'a été inventé. Ajoutez vos
projets/expertise de migration cloud depuis **/admin/migrations** — la
section n'apparaît sur le site public que si elle contient au moins un
élément visible.

### Logos (entreprises, établissements, sponsors)

Les logos de CloudShift, INCEPTUM, Assurances BIAT, Easy Ways Career, ESPRIT
et de la Faculté des Sciences de Tunis, ainsi que les logos sponsors SFBT et
Safia, ont été récupérés depuis leurs sites officiels / pages Wikipédia et
sont déjà en place. Logos non trouvés avec certitude (donc non ajoutés, pour
éviter toute confusion de marque) : Lycée Boumhal, Polina, Naaroua, Saida —
à téléverser vous-même depuis le back-office si vous disposez des fichiers.

### Cas particulier : les 13 actions associatives

Chaque action affiche par défaut l'**embed officiel Instagram** (si un lien
Instagram est renseigné, chargé seulement quand la carte approche de l'écran
pour la performance), avec un bouton de repli « Voir sur Instagram » si
l'embed ne charge pas (hors connexion, bloqué, etc.). Vous pouvez à tout
moment téléverser une **photo personnalisée** depuis le back-office : elle
remplacera alors l'embed Instagram sur la carte. Aucune photo n'a été
téléchargée automatiquement depuis Instagram (voir le rapport de livraison
pour le détail de ce choix).

---

## 3. Sauvegarder et restaurer le contenu (Export / Import JSON)

Dans le back-office, section **Export / Import** :
- **Exporter** télécharge un fichier `portfolio-export-AAAA-MM-JJ.json`
  contenant tout le contenu éditable (profil + toutes les sections).
  Les messages de contact et le compte admin ne sont pas inclus.
- **Importer** restaure le contenu à partir d'un tel fichier. ⚠️ Cette
  opération **remplace entièrement** le contenu des sections concernées —
  exportez d'abord une sauvegarde si vous n'êtes pas sûr.

Conservez le fichier exporté en lieu sûr (ce n'est pas un fichier de code,
il peut être stocké n'importe où, y compris en dehors du projet).

---

## 4. Structure du projet

```
portfolio-ghassen/
├── prisma/
│   ├── schema.prisma      # Modèle de données (SQLite en local, PostgreSQL en prod)
│   └── seed.ts            # Contenu initial (idempotent)
├── scripts/
│   ├── setup.mjs          # npm run setup
│   ├── switch-provider.mjs# npm run use:postgres / use:sqlite
│   └── export-static.mjs  # npm run export (option de secours)
├── src/
│   ├── app/
│   │   ├── [locale]/      # Site public (FR/EN) : sections, layout, pages
│   │   ├── admin/         # Back-office (routes protégées par middleware)
│   │   └── actions/       # Server Actions partagées (contact)
│   ├── components/        # Composants UI partagés (public + admin)
│   ├── i18n/               # Configuration next-intl (routing, navigation)
│   ├── lib/                # Prisma, auth, stockage fichiers, utilitaires
│   └── messages/           # Traductions de l'interface (fr.json, en.json)
├── data/portfolio.db       # Base SQLite locale (créée automatiquement, ignorée par git)
├── public/uploads/         # Fichiers téléversés en local (ignorés par git)
├── .env                    # Configuration locale (jamais commité)
└── .env.example             # Modèle documenté de .env
```

---

## 5. Mettre le site en ligne gratuitement (phase 2)

Le site est conçu pour fonctionner **à l'identique** en SQLite (local) et en
PostgreSQL (production), via le même schéma Prisma.

### 5.1. Services utilisés (offres gratuites)

| Service | Usage | Offre gratuite |
|---|---|---|
| [Vercel](https://vercel.com) | Hébergement du site (plan **Hobby**) | Gratuit pour un usage personnel non commercial. Limites : 100 Go de bande passante/mois, fonctions serverless avec quotas d'exécution, pas de carte bancaire requise pour le plan Hobby. |
| [Neon](https://neon.tech) | Base de données PostgreSQL | Plan gratuit : 1 projet, ~0.5 Go de stockage, la base **se met en veille** après quelques minutes d'inactivité (le premier appel après une veille est plus lent — voir § 5.4). |
| Vercel Blob (optionnel) | Stockage des fichiers uploadés en ligne | Plan gratuit avec quota de stockage et de bande passante. |

Si l'un de ces services demande une carte bancaire ou pousse vers un plan
payant, **arrêtez-vous et vérifiez** avant de continuer — ce prompt est conçu
pour rester 100% gratuit.

### 5.2. Basculer le schéma vers PostgreSQL

1. Créez un projet gratuit sur [neon.tech](https://neon.tech) et récupérez la
   chaîne de connexion PostgreSQL (`postgresql://...`).
2. Mettez à jour `DATABASE_URL` dans `.env` (ou dans les variables
   d'environnement Vercel pour la production) avec cette chaîne.
3. Lancez :
   ```powershell
   npm run use:postgres
   ```
   Ce script bascule le `provider` du schéma Prisma vers `postgresql`,
   régénère le client, synchronise le schéma (`prisma db push`) et réinjecte
   le contenu (idempotent — aucun doublon si déjà rempli).
4. Pour revenir au développement local SQLite :
   ```powershell
   npm run use:sqlite
   ```
   (remettez aussi `DATABASE_URL` sur `file:../data/portfolio.db` dans `.env`)

### 5.3. Déployer sur Vercel

```powershell
npx vercel login      # ouvre le navigateur, connectez-vous vous-même
npx vercel link       # relie ce dossier à un projet Vercel
npx vercel env add DATABASE_URL production
npx vercel env add SESSION_SECRET production
npx vercel env add ADMIN_EMAIL production
npx vercel env add ADMIN_PASSWORD production
npx vercel env add STORAGE_DRIVER production   # "vercel-blob" conseillé en ligne
npx vercel env add BLOB_READ_WRITE_TOKEN production  # si vous activez Vercel Blob
npx vercel --prod
```

- `vercel login` ouvre une page de connexion dans votre navigateur : **vous**
  vous connectez (email, MFA…), l'outil reprend automatiquement ensuite.
- Pour le stockage des fichiers uploadés en production, deux choix :
  - `STORAGE_DRIVER=local` : fonctionne, mais les fichiers uploadés après le
    déploiement ne survivent pas à un redéploiement (disque éphémère sur
    Vercel). Convient pour un usage simple.
  - `STORAGE_DRIVER=vercel-blob` : créez un store Vercel Blob gratuit depuis
    le tableau de bord Vercel (onglet Storage), copiez le jeton
    `BLOB_READ_WRITE_TOKEN`. Les fichiers persistent alors entre les
    déploiements.
- Générez un `SESSION_SECRET` fort pour la production, par exemple :
  ```powershell
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```
- Choisissez un `ADMIN_PASSWORD` fort pour la production (ne réutilisez pas
  `ChangeMe123!`).

### 5.4. Limites à connaître en production (plans gratuits)

- **Neon se met en veille** après quelques minutes d'inactivité. La première
  requête qui la réveille peut prendre quelques secondes. Le site public
  utilise la revalidation incrémentale (ISR, 60 secondes) pour limiter les
  appels à la base ; le back-office affiche les données en direct (un léger
  délai est possible après une période d'inactivité).
- **Vercel Hobby** : usage personnel/non commercial uniquement, quotas de
  bande passante et de temps d'exécution des fonctions serverless.
- **Vercel Blob gratuit** : quota de stockage et de bande passante limité.

### 5.5. Option de secours : export statique (sans base de données en ligne)

```powershell
npm run export
```

Génère un dossier `export/` contenant une version **statique et en lecture
seule** des pages `/fr` et `/en` (à héberger sur n'importe quel serveur
statique). Limites assumées de cette option de secours : **pas de
back-office**, **pas de formulaire de contact fonctionnel** (seuls les liens
email/téléphone restent utilisables), le contenu est figé au moment de
l'export. À utiliser uniquement si Vercel/Neon ne sont pas disponibles.

---

## 6. Commandes utiles

| Commande | Effet |
|---|---|
| `npm run dev` | Démarre le site en développement |
| `npm run build` | Build de production |
| `npm run start` | Démarre le serveur de production (après `build`) |
| `npm run lint` | Vérifie le code (ESLint) |
| `npm run setup` | Initialise `.env`, la base de données et le contenu (idempotent) |
| `npm run seed` | Réinjecte le contenu seul (idempotent) |
| `npm run db:push` | Synchronise le schéma Prisma avec la base sans reseed |
| `npm run use:postgres` | Bascule le provider Prisma vers PostgreSQL |
| `npm run use:sqlite` | Revient au provider SQLite |
| `npm run export` | Génère un export statique de secours (voir § 5.5) |

---

## 7. Sécurité et secrets

- Aucun secret n'est écrit en dur dans le code ou committé : tout passe par
  `.env` (local, ignoré par git) ou les variables d'environnement Vercel
  (production).
- `.gitignore` exclut déjà `.env*` (sauf `.env.example`), `data/*.db` et
  `public/uploads/*`.
- Le mot de passe administrateur est haché (bcrypt) en base — jamais stocké
  en clair.
- La session admin est un cookie **HTTP-only, signé** (JWT), non accessible
  en JavaScript côté navigateur.
- Le formulaire de contact est protégé par un champ honeypot (anti-bot) et
  une limitation de débit par adresse IP (3 messages / 10 minutes).

---

## 8. Ce qui a été testé (résumé)

Voir le rapport de livraison fourni séparément pour le détail complet des
tests effectués (build, CRUD par section, upload, formulaire de contact,
changement de langue/thème, responsive mobile, export/import).

## 9. Support

Ce projet n'utilise aucune dépendance propriétaire : Next.js, Prisma,
next-intl, Tailwind CSS, bcryptjs, jose, zod — toutes open source. Pour toute
question sur une bibliothèque, consultez sa documentation officielle.
"# portfolio" 
#   p o r t f o l i o  
 #   p o r t f o l i o  
 
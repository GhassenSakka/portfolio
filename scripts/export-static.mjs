// Option de secours : export STATIQUE en lecture seule (sans base de données
// en ligne), pour un hébergement 100% statique si Vercel/Neon ne sont pas
// disponibles. Limites assumées (voir README) : pas de back-office, pas de
// base de données, le formulaire de contact n'est plus fonctionnel (les
// pages statiques n'ont pas de serveur pour traiter les Server Actions) —
// seul un lien "mailto:" reste disponible via la page déjà publiée.
//
// Fonctionnement : réutilise les pages /fr et /en déjà pré-rendues par
// `next build` (ISR) grâce à generateStaticParams, et les republie avec
// leurs assets dans le dossier export/.
import { cpSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const nextDir = path.join(root, ".next");
const exportDir = path.join(root, "export");

function log(message) {
  console.log(`\n[export] ${message}`);
}

log("Build de production (npm run build)...");
const build = spawnSync("npx", ["next", "build"], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (build.status !== 0) process.exit(build.status ?? 1);

if (!existsSync(path.join(nextDir, "server", "app", "fr.html"))) {
  console.error(
    "\n[export] Impossible de trouver les pages pré-rendues (.next/server/app/fr.html).\n" +
      "Le build a peut-être échoué, ou la page d'accueil n'est plus statiquement pré-rendue."
  );
  process.exit(1);
}

rmSync(exportDir, { recursive: true, force: true });
mkdirSync(exportDir, { recursive: true });

// Assets Next.js (JS/CSS versionnés)
mkdirSync(path.join(exportDir, "_next"), { recursive: true });
cpSync(path.join(nextDir, "static"), path.join(exportDir, "_next", "static"), { recursive: true });

// Fichiers publics (uploads, favicon, etc.)
cpSync(path.join(root, "public"), exportDir, { recursive: true });

// Pages FR / EN pré-rendues
for (const locale of ["fr", "en"]) {
  const htmlSrc = path.join(nextDir, "server", "app", `${locale}.html`);
  const destDir = path.join(exportDir, locale);
  mkdirSync(destDir, { recursive: true });
  cpSync(htmlSrc, path.join(destDir, "index.html"));
}

// robots.txt / sitemap.xml
const robotsBody = path.join(nextDir, "server", "app", "robots.txt.body");
if (existsSync(robotsBody)) {
  writeFileSync(path.join(exportDir, "robots.txt"), readFileSync(robotsBody));
}
const sitemapBody = path.join(nextDir, "server", "app", "sitemap.xml.body");
if (existsSync(sitemapBody)) {
  writeFileSync(path.join(exportDir, "sitemap.xml"), readFileSync(sitemapBody));
}

// Redirection racine -> /fr/
writeFileSync(
  path.join(exportDir, "index.html"),
  `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=/fr/" />
    <title>Ghassen SAKKA</title>
  </head>
  <body>
    <p>Redirection... <a href="/fr/">Cliquez ici si rien ne se passe</a>.</p>
  </body>
</html>
`
);

log("Export statique généré dans ./export");
log(
  "⚠️  Snapshot en LECTURE SEULE : pas de back-office, pas de base de données,\n" +
    "    le formulaire de contact n'est plus actif sur cet export (voir README)."
);
log('Pour tester localement : npx serve export   (puis ouvrez le lien affiché)');

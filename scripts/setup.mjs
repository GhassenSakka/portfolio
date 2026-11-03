// Orchestration de `npm run setup` :
// 1. Crée .env depuis .env.example si absent
// 2. Génère un SESSION_SECRET aléatoire si besoin
// 3. Synchronise le schéma Prisma avec la base (prisma db push)
// 4. Injecte le contenu du seed (idempotent)
import { existsSync, copyFileSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const envPath = path.join(root, ".env");
const envExamplePath = path.join(root, ".env.example");

function log(message) {
  console.log(`\n[setup] ${message}`);
}

function run(command, args) {
  log(`${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    console.error(`\n[setup] Échec de la commande : ${command} ${args.join(" ")}`);
    process.exit(result.status ?? 1);
  }
}

// 1. .env
if (!existsSync(envPath)) {
  log(".env absent -> copie depuis .env.example");
  copyFileSync(envExamplePath, envPath);
} else {
  log(".env déjà présent — conservé tel quel.");
}

// 2. SESSION_SECRET
let envContent = readFileSync(envPath, "utf8");
const sessionSecretMatch = envContent.match(/^SESSION_SECRET="?(.*?)"?$/m);
const currentSecret = sessionSecretMatch?.[1] ?? "";

if (!currentSecret || currentSecret === "changeme-generated-by-setup") {
  const newSecret = randomBytes(48).toString("hex");
  if (sessionSecretMatch) {
    envContent = envContent.replace(/^SESSION_SECRET="?(.*?)"?$/m, `SESSION_SECRET="${newSecret}"`);
  } else {
    envContent += `\nSESSION_SECRET="${newSecret}"\n`;
  }
  writeFileSync(envPath, envContent, "utf8");
  log("SESSION_SECRET généré automatiquement et écrit dans .env.");
} else {
  log("SESSION_SECRET déjà défini — conservé tel quel.");
}

// Dossiers nécessaires
mkdirSync(path.join(root, "data"), { recursive: true });
mkdirSync(path.join(root, "public", "uploads"), { recursive: true });

// 3. Schéma -> base de données
run("npx", ["prisma", "generate"]);
run("npx", ["prisma", "db", "push", "--accept-data-loss", "--skip-generate"]);

// 4. Seed (idempotent)
run("npx", ["tsx", "prisma/seed.ts"]);

log("Terminé ! Lancez maintenant : npm run dev");
log("Site : http://localhost:3000  —  Back-office : http://localhost:3000/admin");

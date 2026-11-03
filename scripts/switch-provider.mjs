// Bascule le provider Prisma entre "sqlite" (local) et "postgresql" (production),
// sans jamais toucher aux modèles du schéma. Usage :
//   npm run use:postgres   (après avoir mis à jour DATABASE_URL dans .env/.env.production)
//   npm run use:sqlite     (retour au développement local)
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const schemaPath = path.join(root, "prisma", "schema.prisma");
const envPath = path.join(root, ".env");

const target = process.argv[2];
if (target !== "sqlite" && target !== "postgresql") {
  console.error('Usage: node scripts/switch-provider.mjs <sqlite|postgresql>');
  process.exit(1);
}

function run(command, args) {
  console.log(`\n[use:${target}] ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

let schema = readFileSync(schemaPath, "utf8");
const providerRegex = /(datasource\s+db\s*\{[^}]*provider\s*=\s*)"(sqlite|postgresql)"/s;

if (!providerRegex.test(schema)) {
  console.error("Impossible de trouver le bloc datasource dans prisma/schema.prisma.");
  process.exit(1);
}

schema = schema.replace(providerRegex, `$1"${target}"`);
writeFileSync(schemaPath, schema, "utf8");
console.log(`prisma/schema.prisma -> provider = "${target}"`);

if (target === "postgresql" && existsSync(envPath)) {
  const env = readFileSync(envPath, "utf8");
  const urlMatch = env.match(/^DATABASE_URL="(.*)"$/m);
  if (urlMatch && urlMatch[1].startsWith("file:")) {
    console.warn(
      "\n⚠️  DATABASE_URL pointe encore vers un fichier SQLite (file:...).\n" +
        "   Mettez à jour DATABASE_URL dans .env (ou .env.production) avec votre\n" +
        "   chaîne de connexion PostgreSQL (Neon) AVANT de continuer, puis relancez\n" +
        "   cette commande, ou lancez directement :\n" +
        "   npx prisma db push && npx tsx prisma/seed.ts\n"
    );
    process.exit(1);
  }
}

run("npx", ["prisma", "generate"]);
run("npx", ["prisma", "db", "push", "--accept-data-loss", "--skip-generate"]);
run("npx", ["tsx", "prisma/seed.ts"]);

console.log(`\n✅ Base de données synchronisée en mode "${target}".`);

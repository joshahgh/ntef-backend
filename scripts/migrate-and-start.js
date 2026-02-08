const { execSync } = require("child_process");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const maxTries = Number(process.env.MIGRATE_MAX_TRIES || 15);
  const delayMs = Number(process.env.MIGRATE_DELAY_MS || 5000);

  for (let i = 1; i <= maxTries; i++) {
    try {
      console.log(`🔄 Prisma migrate deploy (try ${i}/${maxTries})...`);
      execSync("npx prisma migrate deploy", { stdio: "inherit" });
      console.log("✅ Prisma migrate deploy successful.");
      break;
    } catch (err) {
      console.log(`⚠️ Migrate failed (try ${i}). Waiting ${delayMs}ms...`);
      if (i === maxTries) {
        console.error("❌ Prisma migrate deploy failed too many times.");
        process.exit(1);
      }
      await sleep(delayMs);
    }
  }

  console.log("🚀 Starting Nest app...");
  execSync("node dist/main.js", { stdio: "inherit" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

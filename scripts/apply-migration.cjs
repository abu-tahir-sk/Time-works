const { Client } = require("pg");
const fs = require("fs");
const crypto = require("crypto");

// Read DATABASE_URL from .env
const env = fs.readFileSync(".env", "utf8");
const match = env.match(/DATABASE_URL="(.*?)"/);
const url = match[1];

const sql = fs.readFileSync(
  "prisma/migrations/20261117000000_add_agreements/migration.sql",
  "utf8"
);

const c = new Client({ connectionString: url });
c.connect()
  .then(() => c.query(sql))
  .then(() => {
    console.log("MIGRATION APPLIED");
    return c.end();
  })
  .catch((e) => {
    console.error("ERR:", e.message);
    process.exit(1);
  });

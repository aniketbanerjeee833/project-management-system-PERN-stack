import fs from "fs";
import path from "path";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const sqlPath = path.resolve(
    process.cwd(),
    "migrations",
    "init.sql"
  );

  const sql = fs.readFileSync(sqlPath, "utf8");

  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();

    console.log("Connected to DB");

    await client.query(sql);

    console.log("Migration applied successfully");
  } catch (err) {
    console.error("Migration failed", err);

    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
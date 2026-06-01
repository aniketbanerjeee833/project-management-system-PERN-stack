import "dotenv/config";
import app from "./app";
import { pool } from "./db/pool";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // verify DB connection before accepting traffic
    await pool.query("SELECT 1");
    console.log("✓ Database connected");

    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`  http://localhost:${PORT}/health`);
    });

  } catch (err) {
    console.error("✗ Failed to connect to database", err);
    process.exit(1);
  }
}

startServer();
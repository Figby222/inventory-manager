import pg from "pg";
import "dotenv/config";
const { Pool } = pg;

export default new Pool({
    connectionString: process.env.DATABASE_URL,
})
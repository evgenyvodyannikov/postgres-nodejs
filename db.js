import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: 'localhost',
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE_NAME
});

export default pool;
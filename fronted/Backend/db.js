import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  host: "dpg-d8k0ib57vvec73e7i6gg-a.oregon-postgres.render.com",
  port: 5432,
  database: "cliente_qyqz",
  user: "cliente_qyqz_user",
  password:"8iJbcyqJtwUB1qwAaPAwvt3hzBFaidX7",
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function initializePool() {
  await pool.query("SELECT NOW()");
  console.log("✅ PostgreSQL conectado");
}

export default pool;
import sql from "mssql/msnodesqlv8.js";
 
const config = {
  server: "LAPTOP-GNIDI8TC",
  database: "cliente",
  user: "eduardo123",
  password: "e-267Lcdx",
  driver: "ODBC Driver 18 for SQL Server",
  options: {
    instanceName: "SQLEXPRESS",
    encrypt: false,
    trustServerCertificate: true,
    trustedConnection: false,
  },
};
let pool = null;

export async function initializePool() {
  try {
    console.log("🔄 Conectando a SQL Server...");
    pool = await sql.connect(config);
    console.log("✅ Conectado a SQL Server con usuario: eduardo123");
    return pool;
  } catch (err) {
    console.error("❌ Error de conexión:", err.message);
    throw err;
  }
}

export function getPool() {
  if (!pool) throw new Error("Pool not initialized");
  return pool;
}
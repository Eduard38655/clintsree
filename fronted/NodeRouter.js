import cors from "cors";
import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { initializePool } from "./Backend/db.js";
import GetAllUser from "./Backend/GetAllUser.js";
import InsertUser from "./Backend/InsertUser.js";
const app = express();
// Necesario para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/GetAllUser", GetAllUser);
app.use("/InsertUser", InsertUser);
// Configuración
const PORT = process.env.PORT || 10000;
const HOST = process.env.HOST || "localhost";

await initializePool();

// Levantar servidor


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
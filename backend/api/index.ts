import express from "express";
import cors from "cors";
import { grupos } from "../src/ligaData";
import { buscarPontuacao } from "../src/cartolaService";
// Note os dois pontos (../) para sair da pasta api e entrar na src
const app = express();
app.use(cors());
app.use(express.json());

app.get("/liga", async (req, res) => {
  // ... (mantenha sua lógica atual da rota /liga)
});

export default app; // A Vercel precisa do export default
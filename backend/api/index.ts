import express from "express";
import cors from "cors";
import { grupos } from "../src/ligaData";
import { buscarPontuacao } from "../src/cartolaService";

const app = express();

// Configuração do CORS para permitir que seu frontend acesse a API
app.use(cors());
app.use(express.json());

app.get("/liga", async (req, res) => {
  try {
    const resultado: any = {};

    // Percorre cada grupo (A, B, C...) definido no seu ligaData.ts
    for (const [nomeGrupo, ids] of Object.entries(grupos)) {
      const promessas = ids.map(id => buscarPontuacao(id));
      const timesBusca = await Promise.all(promessas);
      
      // Filtra times que deram erro na busca e ordena por pontuação geral
      resultado[nomeGrupo] = timesBusca
        .filter(t => t !== null)
        .sort((a, b) => (b?.pontosGeral || 0) - (a?.pontosGeral || 0));
    }

    res.json(resultado);
  } catch (error) {
    console.error("Erro na rota /liga:", error);
    res.status(500).json({ error: "Erro ao buscar dados da liga" });
  }
});

// IMPORTANTE: Remova qualquer app.listen(3000) daqui de dentro
export default app;
import express from "express";
import cors from "cors";
import { grupos } from "./ligaData";
import { buscarPontuacao, TimeCartola } from "./cartolaService";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor funcionando ✅");
});

app.get("/liga", async (req, res) => {
  try {
    const resultado: Record<string, TimeCartola[]> = {};

    for (const grupo in grupos) {
      const timesIds = grupos[grupo];

      const dados = await Promise.all(
        timesIds.map((id: number) => buscarPontuacao(id))
      );

      resultado[grupo] = dados
        .filter((time): time is TimeCartola => time !== null)
        .sort((a, b, ) => b.pontosGeral - a.pontosGeral);
    }

    res.json(resultado);

  } catch (error) {
    console.error("Erro geral na rota /liga:", error);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000 🚀");
});
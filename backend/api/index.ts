import express from "express";
import cors from "cors";
import { grupos } from "../src/ligaData";
import { buscarPontuacao } from "../src/cartolaService";
import pontosR1 from "../src/pontosR1.json";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/liga", async (req, res) => {
  try {
    const resultado: any = {};
    const descontos: any = pontosR1;

    // Usamos Object.entries com 'any' para evitar o erro de sublinhado no 'ids'
    for (const [nomeGrupo, ids] of Object.entries(grupos as any)) {
      
      // Aqui tratamos ids como uma lista de qualquer tipo (string ou number)
      const listaIds = ids as any[]; 
      const promessas = listaIds.map(id => buscarPontuacao(id));
      
      const timesBusca = await Promise.all(promessas);
      
      resultado[nomeGrupo] = timesBusca
        .filter(t => t !== null)
        .map((time: any) => {
          // Buscamos o desconto convertendo o ID para string para bater com o JSON
          const desconto = descontos[String(time.id)] || 0;
          return {
            ...time,
            pontosGeral: Number((time.pontosRodada + desconto).toFixed(2))
          };
        })
        .sort((a, b) => b.pontosGeral - a.pontosGeral);
    }

    res.json(resultado);
  } catch (error) {
    console.error("Erro na rota /liga:", error);
    res.status(500).json({ error: "Erro ao buscar dados da liga" });
  }
});

export default app;
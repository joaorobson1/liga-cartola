import express from 'express';
import cors from 'cors';
import { grupos } from './ligaData';
import { buscarPontuacao, TimeCartola } from './cartolaService';

const app = express();
app.use(cors());
app.use(express.json());

const buscarDadosLiga = async () => {
  const resultado: Record<string, TimeCartola[]> = {};

  for (const [nomeGrupo, ids] of Object.entries(grupos)) {
    const promessas = ids.map((id) => buscarPontuacao(id));
    const timesBusca = await Promise.all(promessas);

    resultado[nomeGrupo] = timesBusca
      .filter((time): time is TimeCartola => time !== null)
      .map((time) => ({
        ...time,
        pontosGeral: Number(time.pontosGeral.toFixed(2))
      }))
      .sort((a, b) => b.pontosGeral - a.pontosGeral);
  }

  return resultado;
};

const responderLiga = async (_req: express.Request, res: express.Response) => {
  try {
    const dados = await buscarDadosLiga();
    res.json(dados);
  } catch (error) {
    console.error('Erro na rota de liga:', error);
    res.status(500).json({ error: 'Erro ao buscar dados da liga' });
  }
};

app.get('/api/liga', responderLiga);
app.get('/liga', responderLiga);

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Rodando na ${PORT}`));
}

export default app;

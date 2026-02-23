import express from 'express';
import cors from 'cors';
import { buscarDadosLiga } from './cartolaService';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/liga', async (req, res) => {
  try {
    const dados = await buscarDadosLiga();
    res.json(dados);
  } catch (error) {
    res.status(500).json({ error: "Erro interno" });
  }
});

// Isso é importante para o localhost
const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Rodando na ${PORT}`));
}

// OBRIGATÓRIO PARA VERCEL
export default app;
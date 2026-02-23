import axios from "axios";
// Importamos o arquivo JSON com os pontos da R1
import pontosR1 from "../src/pontosR1.json";

export type TimeCartola = {
  nome: string;
  escudo: string;
  pontosRodada: number;
  pontosGeral: number;
};

// Interface para facilitar a leitura do JSON
const cacheR1: Record<string, number> = pontosR1;

export async function buscarPontuacao(timeId: number): Promise<TimeCartola | null> {
  try {
    // Faz apenas UMA chamada para a API (mais rápido e estável)
    const response = await axios.get(
      `https://api.cartola.globo.com/time/id/${timeId}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json"
        }
      }
    );

    const data = response.data;

    if (!data || !data.time) {
      return null;
    }

    const totalCampeonato = data.pontos_campeonato ?? 0;
    // Busca o ponto da R1 no nosso arquivo local. Se não achar, assume 0.
    const pontosParaSubtrair = cacheR1[timeId.toString()] || 0;

    return {
      nome: data.time.nome,
      escudo: data.time.escudos?.["60x60"] || "",
      pontosRodada: data.pontos ?? 0,
      // Faz a subtração localmente
      pontosGeral: totalCampeonato - pontosParaSubtrair
    };

  } catch (error: any) {
    console.error(`Erro ao buscar time ${timeId}:`, error.message);
    return null;
  }
}
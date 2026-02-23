import axios from "axios";
// Importação correta para CommonJS + resolveJsonModule
import * as pontosR1 from "./pontosR1.json";

export type TimeCartola = {
  nome: string;
  escudo: string;
  pontosRodada: number;
  pontosGeral: number;
};

// Forçamos o TypeScript a entender o JSON como um dicionário de números
const cacheR1: Record<string, number> = (pontosR1 as any).default || pontosR1;

export async function buscarPontuacao(timeId: number): Promise<TimeCartola | null> {
  try {
    const response = await axios.get(
      `https://api.cartola.globo.com/time/id/${timeId}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );

    const data = response.data;
    if (!data || !data.time) return null;

    const totalCampeonato = data.pontos_campeonato ?? 0;
    
    // Buscamos o ID no JSON. Se não existir, subtraímos 0.
    const pontosParaSubtrair = cacheR1[timeId.toString()] || 0;

    return {
      nome: data.time.nome,
      escudo: data.time.escudos?.["60x60"] || "",
      pontosRodada: data.pontos ?? 0,
      pontosGeral: totalCampeonato - pontosParaSubtrair
    };

  } catch (error: any) {
    console.error(`Erro no time ${timeId}:`, error.message);
    return null;
  }
}
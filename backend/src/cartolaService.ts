import axios from "axios";
import * as pontosR1 from "./pontosR1.json";

export type TimeCartola = {
  id: number;
  nome: string;
  escudo: string;
  pontosRodada: number;
  pontosGeral: number;
};

const cacheR1: Record<string, number> = (pontosR1 as any).default || pontosR1;

// 1. Sua função de buscar por ID (Individual)
export async function buscarPontuacao(timeId: number): Promise<TimeCartola | null> {
  try {
    const response = await axios.get(
      `https://api.cartola.globo.com/time/id/${timeId}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );

    const data = response.data;
    if (!data || !data.time) return null;

    const totalCampeonato = data.pontos_campeonato ?? 0;
    const pontosParaSubtrair = cacheR1[timeId.toString()] || 0;

    return {
      id: timeId,
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

// 2. A FUNÇÃO QUE FALTAVA (Que o server.ts chama)
export const buscarDadosLiga = async () => {
  // Coloque aqui os IDs de todos os times que participam da sua liga
  const idsDosTimes = [
    1111111, 2222222, 3333333, 4444444 // Substitua pelos IDs reais
  ];

  const promessas = idsDosTimes.map(id => buscarPontuacao(id));
  const resultados = await Promise.all(promessas);
  
  // Remove nulos (times que deram erro na API)
  const times = resultados.filter((t): t is TimeCartola => t !== null);

  // 3. Organização por Grupos
  const grupos = {
    grupoA: times.slice(0, 4), // Exemplo: primeiros 4 times
    grupoB: times.slice(4, 8), // Próximos 4 times
    // Adicione os outros grupos conforme sua necessidade
  };

  // Ordena cada grupo por pontos
  Object.keys(grupos).forEach(key => {
    (grupos as any)[key].sort((a: any, b: any) => b.pontosGeral - a.pontosGeral);
  });

  return grupos;
};
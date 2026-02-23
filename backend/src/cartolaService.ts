import axios from "axios";

export interface TimeCartola {
  id: string | number;
  nome: string;
  escudo: string;
  pontosRodada: number;
  pontosGeral: number;
}

export const buscarPontuacao = async (id: string | number): Promise<TimeCartola | null> => {
  try {
    const response = await axios.get(`https://api.cartola.globo.com/time/id/${id}`);
    const data = response.data;

    return {
      id: id,
      nome: data.time.nome,
      escudo: data.time.url_escudo,
      pontosRodada: data.pontos || 0,
      pontosGeral: 0,
    };
  } catch (error) {
    console.error(`Erro ao buscar time ${id}:`, error);
    return null;
  }
};
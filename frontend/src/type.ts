export interface Time {
  nome: string;
  escudo: string;
  pontosRodada: number;
  pontosGeral: number;
}

export interface LigaData {
  grupoA: Time[];
  grupoB: Time[];
}
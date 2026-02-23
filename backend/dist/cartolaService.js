"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buscarDadosLiga = void 0;
exports.buscarPontuacao = buscarPontuacao;
const axios_1 = __importDefault(require("axios"));
const pontosR1 = __importStar(require("./pontosR1.json"));
const cacheR1 = pontosR1.default || pontosR1;
// 1. Sua função de buscar por ID (Individual)
async function buscarPontuacao(timeId) {
    try {
        const response = await axios_1.default.get(`https://api.cartola.globo.com/time/id/${timeId}`, { headers: { "User-Agent": "Mozilla/5.0" } });
        const data = response.data;
        if (!data || !data.time)
            return null;
        const totalCampeonato = data.pontos_campeonato ?? 0;
        const pontosParaSubtrair = cacheR1[timeId.toString()] || 0;
        return {
            id: timeId,
            nome: data.time.nome,
            escudo: data.time.escudos?.["60x60"] || "",
            pontosRodada: data.pontos ?? 0,
            pontosGeral: totalCampeonato - pontosParaSubtrair
        };
    }
    catch (error) {
        console.error(`Erro no time ${timeId}:`, error.message);
        return null;
    }
}
// 2. A FUNÇÃO QUE FALTAVA (Que o server.ts chama)
const buscarDadosLiga = async () => {
    // Coloque aqui os IDs de todos os times que participam da sua liga
    const idsDosTimes = [
        1111111, 2222222, 3333333, 4444444 // Substitua pelos IDs reais
    ];
    const promessas = idsDosTimes.map(id => buscarPontuacao(id));
    const resultados = await Promise.all(promessas);
    // Remove nulos (times que deram erro na API)
    const times = resultados.filter((t) => t !== null);
    // 3. Organização por Grupos
    const grupos = {
        grupoA: times.slice(0, 4), // Exemplo: primeiros 4 times
        grupoB: times.slice(4, 8), // Próximos 4 times
        // Adicione os outros grupos conforme sua necessidade
    };
    // Ordena cada grupo por pontos
    Object.keys(grupos).forEach(key => {
        grupos[key].sort((a, b) => b.pontosGeral - a.pontosGeral);
    });
    return grupos;
};
exports.buscarDadosLiga = buscarDadosLiga;

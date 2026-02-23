"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ligaData_1 = require("./ligaData");
const cartolaService_1 = require("./cartolaService");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const buscarDadosLiga = async () => {
    const resultado = {};
    for (const [nomeGrupo, ids] of Object.entries(ligaData_1.grupos)) {
        const promessas = ids.map((id) => (0, cartolaService_1.buscarPontuacao)(id));
        const timesBusca = await Promise.all(promessas);
        resultado[nomeGrupo] = timesBusca
            .filter((time) => time !== null)
            .map((time) => ({
            ...time,
            pontosGeral: Number(time.pontosGeral.toFixed(2))
        }))
            .sort((a, b) => b.pontosGeral - a.pontosGeral);
    }
    return resultado;
};
const responderLiga = async (_req, res) => {
    try {
        const dados = await buscarDadosLiga();
        res.json(dados);
    }
    catch (error) {
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
exports.default = app;

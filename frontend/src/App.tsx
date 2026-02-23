import { useEffect, useState, useRef } from 'react'
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

interface Time {
  nome: string;
  escudo: string;
  pontosRodada: number;
  pontosGeral: number;
}

interface LigaData {
  [key: string]: Time[];
}

function App() {
  const [dados, setDados] = useState<LigaData | null>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);
  const API_BASE = import.meta.env.VITE_API_BASE ?? 'https://backendliga.vercel.app';

  const buscarDados = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/liga`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ao buscar ${API_BASE}/api/liga`);
      }
      const json = await response.json();
      setDados(json);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarDados();
  }, []);

  const formatarNomeGrupo = (nomeChave: string) => {
    return nomeChave.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  };

  const exportarParaImagem = async () => {
    if (!printRef.current) return;
    const canvas = await html2canvas(printRef.current, {
      backgroundColor: '#0f172a',
      scale: 2,
      useCORS: true
    });
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = image;
    link.download = `Classificacao_Liga.png`;
    link.click();
  };

  const exportarParaExcel = () => {
    if (!dados) return;
    const listaMestre: any[] = [];
    Object.entries(dados).forEach(([nomeGrupo, times]) => {
      listaMestre.push({ "Time": formatarNomeGrupo(nomeGrupo).toUpperCase() });
      times.forEach((t, index) => {
        listaMestre.push({ "Posição": `${index + 1}º`, "Time": t.nome, "Rodada": t.pontosRodada.toFixed(2), "Geral": t.pontosGeral.toFixed(2) });
      });
      listaMestre.push({});
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(listaMestre, { skipHeader: true });
    XLSX.utils.book_append_sheet(wb, ws, "Classificação");
    XLSX.writeFile(wb, "Liga_Mata_Mata.xlsx");
  };

  if (loading) return <div style={{backgroundColor: '#0f172a', height: '100vh', color: '#fbbf24', textAlign: 'center', padding: '50px'}}><h1>Carregando...</h1></div>;

  return (
    <div className="main-wrapper">
      <style>{`
        .main-wrapper { width: 100%; min-height: 100vh; background-color: #0f172a; padding: 20px; display: flex; flex-direction: column; align-items: center; color: white; font-family: sans-serif; }
        header { text-align: center; margin-bottom: 30px; }
        h1 { color: #fbbf24; font-size: 2.5rem; font-style: italic; font-weight: 900; }
        
        .container-botoes { display: flex; gap: 10px; justify-content: center; margin-bottom: 25px; }
        .btn { border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 800; text-transform: uppercase; }
        .btn-atualizar { background: #fbbf24; color: #000; }
        .btn-excel { background: #10b981; color: white; }
        .btn-img { background: #3b82f6; color: white; }

        .grid-grupos { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; width: 100%; max-width: 1600px; padding: 10px; }
        .card-grupo { background: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #334155; }
        .titulo-grupo { background: #334155; padding: 10px; margin: 0; text-align: center; color: #fde047; font-size: 1.1rem; }
        
        table { width: 100%; border-collapse: collapse; }
        th { background: rgba(0,0,0,0.2); color: #64748b; font-size: 0.6rem; padding: 8px; text-transform: uppercase; }
        td { padding: 10px; border-bottom: 1px solid #334155; font-size: 0.85rem; }

        /* ESTILOS DE DESTAQUE */
        .primeiro-lugar { background: rgba(251, 191, 36, 0.15) !important; } /* Fundo dourado suave */
        .segundo-lugar { background: rgba(148, 163, 184, 0.1) !important; } /* Fundo prata suave */
        
        .pos-1 { color: #fbbf24 !important; font-size: 0.9rem; } /* Número 1 em Dourado */
        .pos-2 { color: #cbd5e1 !important; font-size: 0.85rem; } /* Número 2 em Prata */

        .time-cell { display: flex; align-items: center; gap: 8px; }
        .pos { font-weight: bold; color: #475569; width: 20px; }
        .shield { width: 26px; height: 26px; background: #334155; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .nome-time { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 130px; }
        
        .pts-r { color: #38bdf8; font-weight: bold; text-align: right; }
        .pts-g { color: #fbbf24; font-weight: 900; text-align: right; }

        @media (min-width: 1600px) { .grid-grupos { grid-template-columns: repeat(4, 1fr); } }
      `}</style>

      <header>
        <h1>🏆 OBICHO VAI PEGAR</h1>
        <div className="container-botoes">
          <button className="btn btn-atualizar" onClick={buscarDados}>🔄 Atualizar</button>
          
          <button className="btn btn-img" onClick={exportarParaImagem}>📸 Salvar Imagem</button>
        </div>
      </header>

      <main className="grid-grupos" ref={printRef}>
        {dados && Object.entries(dados).map(([key, times]) => (
          <section key={key} className="card-grupo">
            <h2 className="titulo-grupo">{formatarNomeGrupo(key)}</h2>
            <table>
              <thead>
                <tr>
                  <th style={{textAlign: 'left', paddingLeft: '15px'}}>Time</th>
                  <th style={{textAlign: 'right'}}>Rodada</th>
                  <th style={{textAlign: 'right', paddingRight: '15px'}}>Geral</th>
                </tr>
              </thead>
              <tbody>
                {times.map((time, index) => {
                  // Lógica para definir a classe de destaque
                  const classeDestaque = index === 0 ? 'primeiro-lugar' : index === 1 ? 'segundo-lugar' : '';
                  const classePosicao = index === 0 ? 'pos-1' : index === 1 ? 'pos-2' : '';

                  return (
                    <tr key={index} className={classeDestaque}>
                      <td style={{paddingLeft: '15px'}}>
                        <div className="time-cell">
                          <span className={`pos ${classePosicao}`}>{index + 1}º</span>
                          <div className="shield">
                            {time.escudo ? <img src={time.escudo} width="22" crossOrigin="anonymous" /> : '⚽'}
                          </div>
                          <span className="nome-time" style={index === 0 ? {color: '#fef3c7'} : {}}>{time.nome}</span>
                        </div>
                      </td>
                      <td className="pts-r">{time.pontosRodada.toFixed(2)}</td>
                      <td className="pts-g" style={{paddingRight: '15px'}}>{time.pontosGeral.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        ))}
      </main>
    </div>
  )
}

export default App

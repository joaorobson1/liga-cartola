import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import './App.css';

function App() {
  const [dados, setDados] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const buscarDados = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://liga-cartola-mfoy.vercel.app/liga');
      const json = await response.json();
      setDados(json || {});
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarDados();
  }, []);

  const salvarImagem = async () => {
    if (contentRef.current) {
      const canvas = await html2canvas(contentRef.current, {
        useCORS: true,
        backgroundColor: '#0f172a',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = 'tabela-obicho-vai-pegar.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  // Função para tratar a URL e garantir que ela use o s2-cartola da Globo
  const getEscudoUrl = (url: string) => {
    if (!url) return 'https://s.glbimg.com/es/ge/static/comum/img/escudo-vazio.png';
    // Removemos o protocolo para evitar links duplicados
    const urlLimpa = url.replace(/^https?:\/\//, '');
    return `https://s2-cartola.glbimg.com/fit-in/60x60/${urlLimpa}`;
  };

  return (
    <div className="container">
      <header>
        <div className="titulo-centralizado">
          <span className="emoji-grande">🏆</span>
          <h1>OBICHO VAI PEGAR 2026</h1>
        </div>
        <div className="buttons-container">
          <button onClick={buscarDados} disabled={loading} className="btn-azul">
            {loading ? "CARREGANDO..." : "🔄 ATUALIZAR"}
          </button>
          <button onClick={salvarImagem} className="btn-azul">
            📸 SALVAR IMAGEM
          </button>
        </div>
      </header>

      {Object.keys(dados).length > 0 ? (
        <div className="grid-grupos" ref={contentRef}>
          {Object.entries(dados).map(([nomeGrupo, times]) => (
            <div key={nomeGrupo} className="grupo-card">
              <h3>GRUPO {nomeGrupo.replace('grupo', '').toUpperCase()}</h3>
              
              <div className="header-tabela">
                <span>TIME</span>
                <div className="pontos-labels">
                  <span>RODADA</span>
                  <span>GERAL</span>
                </div>
              </div>

              {times.map((time: any, index: number) => (
                <div key={time.id || index} className={`time-row ${index < 2 ? 'destaque-lider' : ''}`}>
                  <div className="time-info">
                    <span className="posicao">{index + 1}º</span>
                    <img 
                      src={getEscudoUrl(time.escudo)} 
                      alt={time.nome} 
                      className="escudo-img"
                      loading="lazy"
                      // Importante: deixamos sem o crossOrigin para o navegador carregar sem frescuras
                    />
                    <span className="nome-time">{time.nome}</span>
                  </div>
                  
                  <div className="pontos-container">
                    <span className="pts-rodada">{(time.pontosRodada || 0).toFixed(2)}</span>
                    <span className="pts-geral">{(time.pontosGeral || 0).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        !loading && <div className="loading-box">Aguardando dados...</div>
      )}
    </div>
  );
}

export default App;
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

  const salvarImagem = async () => {
    if (contentRef.current) {
      const canvas = await html2canvas(contentRef.current, {
        useCORS: true, // Essencial para os escudos aparecerem na foto
        backgroundColor: '#0f172a',
        scale: 2
      });
      const link = document.createElement('a');
      link.download = 'tabela-obicho-vai-pegar.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
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

      {/* Grid centralizada com ref para captura de imagem */}
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
              <div key={time.id} className={`time-row ${index < 2 ? 'destaque-lider' : ''}`}>
                <div className="time-info">
                  <span className="posicao">{index + 1}º</span>
                  <img 
                    src={time.escudo} 
                    alt="" 
                    className="escudo-img" 
                    crossOrigin="anonymous" // Permissão de CORS para imagens externas
                  />
                  <span className="nome-time">{time.nome}</span>
                </div>
                
                <div className="pontos-container">
                  <span className="pts-rodada">{time.pontosRodada.toFixed(2)}</span>
                  <span className="pts-geral">{time.pontosGeral.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
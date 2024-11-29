import React, { useState, useEffect } from 'react';
import ConsumirDados, { GraficoBarras, GraficoPizza, ListagemCompleta, RankingTempoResposta } from './index';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface MetricaCardProps {
  titulo: string;
  valor: string | number;
  icone: string;
  descricao?: string;
}

interface DadosAudio {
  audio: string;
  data_identificacao: string;
  espectrograma: string;
  forma_de_onda: string;
  horario_identificacao: string;
  id: string;
  nome_audio: string;
  tempo_resposta: number;
  tipo_ruido: string;
  confianca?: number;
  duracao?: number;
}

const Dados = () => {
  const [mostrarListagem, setMostrarListagem] = useState(false);
  const [dados, setDados] = useState<DadosAudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gerando, setGerando] = useState(false);

  const calcularMediaTempo = (dados: DadosAudio[]): string => {
    if (dados.length === 0) return '0.00s';
    const media = dados.reduce((acc, item) => acc + item.tempo_resposta, 0) / dados.length;
    return `${media.toFixed(2)}s`;
  };

  const calcularMediaConfianca = (dados: DadosAudio[]): string => {
    if (dados.length === 0) return '0';
    const mediaConfianca = dados.reduce((acc, item) => acc + (item.confianca || 0), 0) / dados.length;
    return mediaConfianca.toFixed(1);
  };

  const formatarDuracaoTotal = (dados: DadosAudio[]): string => {
    const duracaoTotal = dados.reduce((acc, item) => acc + (item.duracao || 0), 0);
    const minutos = Math.floor(duracaoTotal / 60);
    const segundos = Math.floor(duracaoTotal % 60);
    return `${minutos}m ${segundos}s`;
  };

  const gerarPDF = async () => {
    if (gerando) return;
    
    const dashboardMetricas = document.getElementById('dashboard-metricas');
    const dashboardGraficos = document.getElementById('dashboard-graficos');
    
    if (!dashboardMetricas || !dashboardGraficos) {
      setError('Elementos não encontrados para gerar PDF');
      return;
    }

    try {
      setGerando(true);
      setError(null);

      // Aguarda um momento para os gráficos renderizarem completamente
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Captura e adiciona métricas na primeira página
      const canvasMetricas = await html2canvas(dashboardMetricas, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const metricasWidth = pdfWidth - 20; // Margem de 10mm em cada lado
      const metricasHeight = (metricasWidth * canvasMetricas.height) / canvasMetricas.width;
      pdf.addImage(
        canvasMetricas.toDataURL('image/png'), 
        'PNG', 
        10, // Posição X com margem
        10, // Posição Y com margem
        metricasWidth,
        metricasHeight
      );
      
      // Adiciona gráficos na segunda página
      pdf.addPage();
      
      const canvasGraficos = await html2canvas(dashboardGraficos, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const graficosWidth = pdfWidth - 20; // Margem de 10mm em cada lado
      const graficosHeight = (graficosWidth * canvasGraficos.height) / canvasGraficos.width;
      
      // Ajusta a escala se necessário para caber na página
      const escalaGraficos = Math.min(1, (pdfHeight - 20) / graficosHeight);
      const alturaFinal = graficosHeight * escalaGraficos;
      
      pdf.addImage(
        canvasGraficos.toDataURL('image/png'),
        'PNG',
        10, // Posição X com margem
        10, // Posição Y com margem
        graficosWidth * escalaGraficos,
        alturaFinal
      );
      
      pdf.save('dashboard-analise-ruidos.pdf');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      setError('Não foi possível gerar o PDF. Por favor, tente novamente.');
    } finally {
      setGerando(false);
    }
  };

  const calcularEstatisticasPorDia = (dados: DadosAudio[]) => {
    const estatisticas = dados.reduce((acc, item) => {
      const data = new Date(item.data_identificacao).toLocaleDateString();
      if (!acc[data]) {
        acc[data] = { total: 0, tipos: {} };
      }
      acc[data].total++;
      acc[data].tipos[item.tipo_ruido] = (acc[data].tipos[item.tipo_ruido] || 0) + 1;
      return acc;
    }, {} as Record<string, { total: number, tipos: Record<string, number> }>);
    return estatisticas;
  };

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ia/datas`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar dados: ${response.status}`);
        }
        const data = await response.json();
        setDados(data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Erro ao carregar os dados');
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  const MetricaCard: React.FC<MetricaCardProps> = ({ titulo, valor, icone, descricao }) => (
    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center space-x-3">
        <span className="text-3xl bg-gray-200 dark:bg-gray-600 p-3 rounded-full">{icone}</span>
        <div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">{titulo}</h4>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{valor}</p>
          {descricao && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{descricao}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {dados.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="text-xl">Nenhum dado encontrado</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                Dashboard de Análise de Ruídos
              </h2>
              <button
                onClick={gerarPDF}
                disabled={gerando}
                className={`px-6 py-2 ${gerando ? 'bg-gray-500' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-lg shadow-md transition-colors duration-300 flex items-center`}
              >
                {gerando ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Gerando PDF...
                  </>
                ) : (
                  'Exportar PDF'
                )}
              </button>
            </div>

            <div id="dashboard-metricas" className="mb-12">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                <MetricaCard 
                  titulo="Total de Análises"
                  valor={dados.length}
                  icone="📊"
                  descricao="Total de áudios processados"
                />
                <MetricaCard 
                  titulo="Média de Tempo"
                  valor={calcularMediaTempo(dados)}
                  icone="⏱️"
                  descricao="Tempo médio de processamento"
                />
                <MetricaCard 
                  titulo="Análises Hoje"
                  valor={dados.filter(d => new Date(d.data_identificacao).toDateString() === new Date().toDateString()).length}
                  icone="📅"
                  descricao="Análises realizadas hoje"
                />
                <MetricaCard 
                  titulo="Tipos Únicos"
                  valor={new Set(dados.map(d => d.tipo_ruido)).size}
                  icone="🎯"
                  descricao="Tipos diferentes de ruídos"
                />
                <MetricaCard 
                  titulo="Confiança Média"
                  valor={`${calcularMediaConfianca(dados)}%`}
                  icone="🎯"
                  descricao="Média de confiança nas classificações"
                />
                <MetricaCard 
                  titulo="Duração Total"
                  valor={formatarDuracaoTotal(dados)}
                  icone="⏲️"
                  descricao="Tempo total de áudio processado"
                />
              </div>
            </div>

            <div id="dashboard-graficos" className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Distribuição de Tipos de Ruído
                  </h3>
                  <div className="h-64">
                    <GraficoPizza dados={dados} />
                  </div>    
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Tempo de Resposta Médio por Tipo
                  </h3>
                  <div className="h-64">
                    <GraficoBarras dados={dados} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Ranking de Tempo de Resposta
                  </h3>
                  <RankingTempoResposta dados={dados} />
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Análises por Período do Dia
                  </h3>
                  <div className="h-64">
                    {/* Componente para mostrar distribuição por período do dia */}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dados;

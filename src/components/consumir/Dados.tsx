import React, { useState, useEffect } from 'react';
import ConsumirDados, { GraficoBarras, GraficoPizza, ListagemCompleta, RankingTempoResposta } from './index';

const Dados = () => {
  const [mostrarListagem, setMostrarListagem] = useState(false);
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {dados.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="text-xl">Nenhum dado encontrado</p>
          </div>
        ) : (
          <>
            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Distribuição de Tipos de Ruído
                  </h3>
                  <div className="h-64">
                    <GraficoPizza dados={dados} />
                  </div>    
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Tempo de Resposta Médio por Tipo
                  </h3>
                  <div className="h-64">
                    <GraficoBarras dados={dados} />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <RankingTempoResposta dados={dados} />
              </div>
            </div>

            <div className="text-center mb-8">
              <button
                onClick={() => setMostrarListagem(!mostrarListagem)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                {mostrarListagem ? 'Ocultar Lista de Áudios' : 'Visualizar Lista de Áudios'}
              </button>
            </div>

            {mostrarListagem && (
              <div className="transition-all duration-500 ease-in-out">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    Lista Completa de Áudios
                  </h2>
                  <ListagemCompleta dados={dados} />
                </div>
              </div>
            )}

            {!mostrarListagem && (
              <div className="text-center text-gray-600 dark:text-gray-400 mt-4">
                <p className="text-lg">
                  Clique no botão acima para ver a lista completa de áudios e acessar os detalhes individuais.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dados;

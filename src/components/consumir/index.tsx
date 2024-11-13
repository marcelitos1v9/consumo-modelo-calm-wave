import React, { useEffect, useState } from 'react';

const ConsumirDados = () => {
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const response = await fetch('http://10.67.56.156:5000/ia/datas');
        if (!response.ok) {
          throw new Error(`Erro ao buscar os dados: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setDados(data);
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        setErrorMessage('Erro ao buscar os dados: ' + (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  if (loading) {
    return <p className="text-center text-lg text-gray-700 animate-pulse">Carregando...</p>;
  }

  if (errorMessage) {
    return <p className="text-red-500 text-center font-semibold">{errorMessage}</p>;
  }

  return (
    <div className="container mx-auto px-6 py-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-2xl">
      <h2 className="text-4xl font-extrabold text-center text-white mb-8">Dados Obtidos</h2>
      
      {dados.length === 0 ? (
        <p className="text-center text-lg text-white">Nenhum dado encontrado.</p>
      ) : (
        <ul className="space-y-6">
          {dados.map((item, index) => (
            <li
              key={index}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <div className="flex flex-col">
                <p className="font-semibold text-gray-900">
                  <span className="text-gray-600">Data Identificação:</span> {item.data_identificacao}
                </p>
                <p className="font-semibold text-gray-900">
                  <span className="text-gray-600">Horário Identificação:</span> {item.horario_identificacao}
                </p>
                <p className="font-semibold text-gray-900">
                  <span className="text-gray-600">Nome do Áudio:</span> {item.nome_audio}
                </p>
                <p className="font-semibold text-gray-900">
                  <span className="text-gray-600">Tempo de Resposta:</span> {item.tempo_resposta}
                </p>
                <p className="font-semibold text-gray-900">
                  <span className="text-gray-600">Tipo de Ruído:</span> {item.tipo_ruido}
                </p>
              </div>
              <hr className="my-4 border-gray-200" />
            </li>
          ))}
        </ul>
      )}
      
      <footer className="mt-12 text-center text-gray-300 text-sm">
        <p>© {new Date().getFullYear()} Sua Empresa. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default ConsumirDados;

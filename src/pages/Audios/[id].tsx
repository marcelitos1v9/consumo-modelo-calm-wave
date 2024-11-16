import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ResultadoAudio = () => {
  const router = useRouter();
  const { id } = router.query;
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchResultado = async () => {
      if (!id) return;

      console.log(`Buscando resultado para o ID: ${id}`);

      try {
        const response = await fetch(`http://10.67.56.156:5000/ia/data/${id}`);
        console.log(`Resposta da API: ${response.status} ${response.statusText}`);

        if (!response.ok) {
          throw new Error(`Erro ao buscar o resultado: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setResultado(data);
      } catch (error) {
        console.error('Erro ao buscar o resultado:', error);
        setErrorMessage('Erro ao buscar o resultado: ' + (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchResultado();
  }, [id]);

  if (loading) {
    return <p className="text-center text-lg font-medium bg-blue-600 text-white p-4 rounded-lg shadow-md">Carregando...</p>;
  }

  if (errorMessage) {
    return <p className="text-white text-center font-semibold bg-red-600 p-4 rounded-lg shadow-md">{errorMessage}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center text-white">Resultados da Análise</h2>
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
          <pre className="text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(resultado, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ResultadoAudio;

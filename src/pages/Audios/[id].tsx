import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ResultadoAudio = () => {
  const router = useRouter();
  const { id } = router.query; // Obtendo o ID da query string
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchResultado = async () => {
      if (!id) return; // Aguarda até que o ID esteja disponível

      console.log(`Buscando resultado para o ID: ${id}`); // Log do ID

      try {
        const response = await fetch(`http://10.67.56.156:5000/ia/data/${id}`); // Ajuste a URL conforme necessário
        console.log(`Resposta da API: ${response.status} ${response.statusText}`); // Log da resposta

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
    return <p className="text-center text-lg text-gray-700">Carregando...</p>;
  }

  if (errorMessage) {
    return <p className="text-red-500 text-center font-semibold">{errorMessage}</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 sm:px-6 lg:px-8">
      <div className="container p-6">
        <h2 className="text-4xl font-bold mb-6 text-center text-white">Resultados da Análise</h2>
        <pre className="bg-white p-4 rounded-lg">{JSON.stringify(resultado, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ResultadoAudio;

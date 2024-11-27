import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface AudioDetails {
  id: string;
  nome_audio: string;
  tipo_ruido: string;
  data_identificacao: string;
  horario_identificacao: string;
  tempo_resposta: number;
  audio: string;
  espectrograma: string;
  forma_de_onda: string;
}

const AudioDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [audioDetails, setAudioDetails] = useState<AudioDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudioDetails = async () => {
      if (!id) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ia/data/${id}`);
        console.log(`Resposta da API: ${response.status} ${response.statusText}`);

        if (!response.ok) {
          throw new Error(`Erro ao buscar o resultado: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setAudioDetails(data);
      } catch (error) {
        console.error('Erro ao buscar o resultado:', error);
        setError('Erro ao buscar o resultado: ' + (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAudioDetails();
  }, [id]);

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatarHora = (dataString: string) => {
    return new Date(dataString).toLocaleTimeString('pt-BR');
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-red-600 text-white p-4 rounded-lg">{error}</div>
    </div>
  );

  if (!audioDetails) return null;

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="bg-gray-800 rounded-t-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">Análise de Áudio</h1>
            <button 
              onClick={() => router.back()}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Voltar
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Nome do Arquivo</p>
              <p className="text-white font-medium">{audioDetails.nome_audio}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Tipo de Ruído</p>
              <p className="text-white font-medium capitalize">{audioDetails.tipo_ruido}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Tempo de Processamento</p>
              <p className="text-white font-medium">{audioDetails.tempo_resposta.toFixed(3)} segundos</p>
            </div>
          </div>
        </div>

        {/* Player de Áudio */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Áudio Original</h2>
          <div className="bg-gray-700 p-4 rounded-lg">
            <audio 
              controls 
              className="w-full"
              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${audioDetails.audio}`}
            >
              Seu navegador não suporta o elemento de áudio.
            </audio>
          </div>
        </div>

        {/* Visualizações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Espectrograma */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Espectrograma</h2>
            <div className="bg-gray-700 p-2 rounded-lg">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${audioDetails.espectrograma}`}
                alt="Espectrograma"
                className="w-full h-auto rounded-lg object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.png';
                }}
              />
            </div>
          </div>

          {/* Forma de Onda */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Forma de Onda</h2>
            <div className="bg-gray-700 p-2 rounded-lg">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${audioDetails.forma_de_onda}`}
                alt="Forma de Onda"
                className="w-full h-auto rounded-lg object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.png';
                }}
              />
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-gray-800 rounded-xl p-6 mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">Informações Adicionais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Data de Identificação</p>
              <p className="text-white font-medium">{formatarData(audioDetails.data_identificacao)}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Horário de Identificação</p>
              <p className="text-white font-medium">{formatarHora(audioDetails.horario_identificacao)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioDetails;

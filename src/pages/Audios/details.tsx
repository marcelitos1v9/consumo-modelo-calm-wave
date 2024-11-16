import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface AudioDetails {
  id: string;
  data_identificacao: string;
  horario_identificacao: string;
  nome_audio: string;
  tempo_resposta: number;
  tipo_ruido: string;
  espectrograma: string;
  forma_de_onda: string;
  audio: string;
}

const AudioDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [audioDetails, setAudioDetails] = useState<AudioDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudioDetails = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ia/data/${id}`);
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Dados recebidos:', data);
        setAudioDetails(data);
      } catch (error) {
        console.error('Erro completo:', error);
        setError(`Erro ao carregar detalhes do áudio: ${(error as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAudioDetails();
  }, [id]);

  const renderContent = (path: string | undefined, fieldName: string) => {
    if (!path) return null;

    // Como o path já vem com a pasta correta do backend, apenas concatenamos com a URL base
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${path}`;
    console.log(`URL construída para ${fieldName}:`, fullUrl);

    return (
      <div className="border-t border-gray-700 pt-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          {fieldName === 'espectrograma' && 'Espectrograma'}
          {fieldName === 'forma_de_onda' && 'Forma de Onda'}
          {fieldName === 'audio' && 'Áudio Original'}
        </h2>
        
        <div className="bg-gray-700 p-4 rounded-lg mb-4">
          {fieldName === 'espectrograma' || fieldName === 'forma_de_onda' ? (
            <img 
              src={fullUrl}
              alt={fieldName}
              className="w-full h-auto object-contain max-h-[500px] rounded-lg"
              onError={(e) => {
                console.error(`Erro ao carregar imagem ${fieldName}:`, e);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement?.insertAdjacentHTML(
                  'beforeend',
                  '<p class="text-red-400 p-4">Erro ao carregar imagem</p>'
                );
              }}
            />
          ) : fieldName === 'audio' ? (
            <audio 
              controls 
              className="w-full"
              src={fullUrl}
            >
              Seu navegador não suporta o elemento de áudio.
            </audio>
          ) : null}
        </div>

        <p className="text-sm text-gray-400 mt-2">
          Caminho do arquivo: {fullUrl}
        </p>
      </div>
    );
  };

  if (loading) return <div className="text-white">Carregando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!audioDetails) return <div className="text-white">Nenhum detalhe encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Detalhes do Áudio</h1>

          <div className="space-y-6">
            {/* Informações básicas */}
            <div className="border-b border-gray-700 pb-4">
              <h2 className="text-xl font-semibold text-white mb-4">Informações Gerais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">ID</p>
                  <p className="text-lg font-medium text-white">{audioDetails.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Nome do Áudio</p>
                  <p className="text-lg font-medium text-white">{audioDetails.nome_audio}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Tipo de Ruído</p>
                  <p className="text-lg font-medium text-white">{audioDetails.tipo_ruido}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Data de Identificação</p>
                  <p className="text-lg font-medium text-white">{new Date(audioDetails.data_identificacao).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Horário de Identificação</p>
                  <p className="text-lg font-medium text-white">{new Date(audioDetails.horario_identificacao).toLocaleTimeString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Tempo de Resposta</p>
                  <p className="text-lg font-medium text-white">{audioDetails.tempo_resposta.toFixed(2)}s</p>
                </div>
              </div>
            </div>

            {/* Renderiza os arquivos usando os caminhos */}
            {renderContent(audioDetails.espectrograma, 'espectrograma')}
            {renderContent(audioDetails.forma_de_onda, 'forma_de_onda')}
            {renderContent(audioDetails.audio, 'audio')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioDetails;

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import { FaAmbulance, FaCar } from 'react-icons/fa';
import { GiDogBowl, GiFireTruck, GiSoundWaves, GiWaveSurfer } from 'react-icons/gi';
import { BsClock, BsCalendarEvent, BsBarChartFill, BsInfoCircle, BsArrowLeft } from 'react-icons/bs';

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

  const getIcon = (tipo: string) => {
    const icons: {[key: string]: JSX.Element} = {
      'ambulance': <FaAmbulance className="text-2xl" />,
      'dog': <GiDogBowl className="text-2xl" />,
      'firetruck': <GiFireTruck className="text-2xl" />,
      'traffic': <FaCar className="text-2xl" />
    };
    return icons[tipo.toLowerCase()] || <GiSoundWaves className="text-2xl" />;
  };

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl backdrop-blur-sm">
        {error}
      </div>
    </div>
  );

  if (!audioDetails) return null;

  return (
    <>
      <Header/>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="bg-gray-800/40 rounded-2xl p-8 mb-8 backdrop-blur-sm border border-gray-700/30 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                Análise de Áudio
              </h1>
              {getIcon(audioDetails.tipo_ruido)}
            </div>
            <button 
              onClick={() => router.back()}
              className="bg-gray-700/50 hover:bg-gray-600/50 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] border border-gray-600/30 flex items-center gap-2"
            >
              <BsArrowLeft /> Voltar
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/30">
              <p className="text-gray-400 text-sm mb-2 flex items-center gap-2"><GiSoundWaves /> Nome do Arquivo</p>
              <p className="text-white text-lg font-medium">{audioDetails.nome_audio}</p>
            </div>
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/30">
              <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">{getIcon(audioDetails.tipo_ruido)} Tipo de Ruído</p>
              <p className="text-white text-lg font-medium capitalize">{audioDetails.tipo_ruido}</p>
            </div>
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/30">
              <p className="text-gray-400 text-sm mb-2 flex items-center gap-2"><BsClock /> Tempo de Processamento</p>
              <p className="text-white text-lg font-medium">{audioDetails.tempo_resposta.toFixed(3)}s</p>
            </div>
          </div>
        </div>

        {/* Player de Áudio */}
        <div className="bg-gray-800/40 rounded-2xl p-8 mb-8 backdrop-blur-sm border border-gray-700/30 shadow-2xl">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6 flex items-center gap-2">
            <GiSoundWaves /> Áudio Original
          </h2>
          <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/30">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Espectrograma */}
          <div className="bg-gray-800/40 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/30 shadow-2xl">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6 flex items-center gap-2">
              <BsBarChartFill /> Espectrograma
            </h2>
            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${audioDetails.espectrograma}`}
                alt="Espectrograma"
                className="w-full h-auto rounded-lg object-contain hover:scale-[1.02] transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.png';
                }}
              />
            </div>
          </div>

          {/* Forma de Onda */}
          <div className="bg-gray-800/40 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/30 shadow-2xl">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6 flex items-center gap-2">
              <GiWaveSurfer /> Forma de Onda
            </h2>
            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${audioDetails.forma_de_onda}`}
                alt="Forma de Onda"
                className="w-full h-auto rounded-lg object-contain hover:scale-[1.02] transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.png';
                }}
              />
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-gray-800/40 rounded-2xl p-8 mt-8 backdrop-blur-sm border border-gray-700/30 shadow-2xl">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6 flex items-center gap-2">
            <BsInfoCircle /> Informações Adicionais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/30">
              <p className="text-gray-400 text-sm mb-2 flex items-center gap-2"><BsCalendarEvent /> Data de Identificação</p>
              <p className="text-white text-lg font-medium">{formatarData(audioDetails.data_identificacao)}</p>
            </div>
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/30">
              <p className="text-gray-400 text-sm mb-2 flex items-center gap-2"><BsClock /> Horário de Identificação</p>
              <p className="text-white text-lg font-medium">{formatarHora(audioDetails.horario_identificacao)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AudioDetails;

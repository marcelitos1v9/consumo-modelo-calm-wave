import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface AudioItem {
  id: string;
  nome_audio: string;
  tipo_ruido: string;
  data_identificacao: string;
  tempo_resposta: number;
}

const AudioList = () => {
  const [audios, setAudios] = useState<AudioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAudios = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ia/datas`);
        if (!response.ok) throw new Error('Falha ao carregar os dados');
        const data = await response.json();
        setAudios(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAudios();
  }, []);

  if (loading) return <div className="text-center">Carregando...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="grid gap-6">
      {audios.map((audio) => (
        <div
          key={audio.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          onClick={() => router.push(`/Audios/details/${audio.id}`)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {audio.nome_audio}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tipo: {audio.tipo_ruido}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Data: {new Date(audio.data_identificacao).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
              {audio.tempo_resposta.toFixed(2)}s
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AudioList; 
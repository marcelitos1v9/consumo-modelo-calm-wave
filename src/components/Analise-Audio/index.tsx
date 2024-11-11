import React, { useState } from 'react';
import { useRouter } from 'next/router';

const AnaliseAudio = () => {
  const router = useRouter();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file && file.type === 'audio/wav') {
        setAudioFile(file);
        setErrorMessage(null);
      } else {
        setErrorMessage('Por favor, selecione um arquivo de áudio no formato WAV.');
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!audioFile) return;

    const formData = new FormData();
    formData.append('audio', audioFile);
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('URL_DA_API_DE_ANALISE', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Erro na análise do áudio');
      }
      const data = await response.json();
      router.push(`/resultados/${data.id}`);
    } catch (error) {
      setErrorMessage('Erro ao analisar o áudio: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 sm:px-6 lg:px-8">
      <div className="container p-6">
        <h2 className="text-4xl font-bold mb-6 text-center text-white">Análise de Áudio</h2>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl max-w-lg mx-auto transition-transform transform hover:scale-105">
          <div className="mb-6">
            <label className="block text-gray-700 text-lg font-medium mb-2">Selecione um arquivo de áudio (WAV):</label>
            <input
              type="file"
              accept=".wav"
              onChange={handleFileChange}
              className="mt-1 border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-200 ease-in-out hover:border-purple-400"
            />
            {errorMessage && <p className="text-red-500 mt-2 font-semibold">{errorMessage}</p>}
          </div>
          <button 
            type="submit" 
            className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${loading ? 'opacity-60 cursor-not-allowed' : ''}`} 
            disabled={loading}
          >
            {loading ? 'Analisando...' : 'Analisar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AnaliseAudio;

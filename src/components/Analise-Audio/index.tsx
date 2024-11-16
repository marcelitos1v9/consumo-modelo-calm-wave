import React, { useState } from 'react';

interface AnalysisResult {
  analysis_results: {
    predicted_class: string;
    tempo_resposta: number;
    saved_id: string;
    spectrogram_base64: string;
    waveform_base64: string;
    audio_vector: string;
  };
  id: string;
  message: string;
}

const AnaliseAudio = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

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

  const renderContent = (path: string | undefined, fieldName: string) => {
    if (!path) return null;

    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${path}`;
    console.log(`URL construída para ${fieldName}:`, fullUrl);

    return (
      <div className="border-t border-gray-700 pt-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          {fieldName === 'spectrogram_base64' && 'Espectrograma'}
          {fieldName === 'waveform_base64' && 'Forma de Onda'}
          {fieldName === 'audio_vector' && 'Áudio Original'}
        </h2>
        
        <div className="bg-gray-700 p-4 rounded-lg mb-4">
          {(fieldName === 'spectrogram_base64' || fieldName === 'waveform_base64') ? (
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
          ) : fieldName === 'audio_vector' ? (
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!audioFile) return;

    const formData = new FormData();
    formData.append('file', audioFile);
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ia/insert_audio`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ${response.status}: ${errorData.message || 'Erro na análise do áudio'}`);
      }

      const data = await response.json();
      console.log('Dados recebidos:', data);

      setAnalysisResult(data);
    } catch (error) {
      console.error('Erro completo:', error);
      setErrorMessage('Erro ao analisar o áudio: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Análise de Áudio</h1>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="mb-6">
              <label className="block text-gray-300 text-lg font-medium mb-2">
                Selecione um arquivo de áudio (WAV):
              </label>
              <input
                type="file"
                accept=".wav"
                onChange={handleFileChange}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
              />
              {errorMessage && (
                <p className="mt-2 text-red-400">{errorMessage}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !audioFile}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                loading || !audioFile
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {loading ? 'Analisando...' : 'Analisar Áudio'}
            </button>
          </form>

          {analysisResult && (
            <div className="space-y-6">
              <div className="border-b border-gray-700 pb-4">
                <h2 className="text-xl font-semibold text-white mb-4">Resultados da Análise</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Tipo de Ruído</p>
                    <p className="text-lg font-medium text-white">
                      {analysisResult.analysis_results.predicted_class || 'Não identificado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">ID do Registro</p>
                    <p className="text-lg font-medium text-white">
                      {analysisResult.id || 'Não disponível'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Tempo de Resposta</p>
                    <p className="text-lg font-medium text-white">
                      {analysisResult.analysis_results.tempo_resposta ? `${analysisResult.analysis_results.tempo_resposta.toFixed(2)}s` : '0.00s'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-400 mb-4">
                <pre>
                  {JSON.stringify(analysisResult, null, 2)}
                </pre>
              </div>

              {analysisResult.analysis_results.spectrogram_base64 && (
                renderContent(analysisResult.analysis_results.spectrogram_base64, 'spectrogram_base64')
              )}
              {analysisResult.analysis_results.waveform_base64 && (
                renderContent(analysisResult.analysis_results.waveform_base64, 'waveform_base64')
              )}
              {analysisResult.analysis_results.audio_vector && (
                renderContent(analysisResult.analysis_results.audio_vector, 'audio_vector')
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnaliseAudio;

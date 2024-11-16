import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import XLSX from 'xlsx';
import { useRouter } from 'next/router';

const ConsumirDados = () => {
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tipoRuidoSelecionado, setTipoRuidoSelecionado] = useState<string | null>(null);
  const [visualizacaoCompleta, setVisualizacaoCompleta] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ia/datas`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar os dados: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.length === 0) {
          setErrorMessage('Nenhum dado encontrado.');
        } else {
          // Ordenando os dados por data e hora (mais recentes primeiro)
          const dadosOrdenados = data.sort((a: any, b: any) => {
            const dataA = new Date(`${a.data_identificacao} ${a.horario_identificacao}`);
            const dataB = new Date(`${b.data_identificacao} ${b.horario_identificacao}`);
            return dataB.getTime() - dataA.getTime();
          });
          setDados(dadosOrdenados);
        }
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
    return <p className="text-center text-lg text-gray-700">Carregando...</p>;
  }

  if (errorMessage) {
    return <p className="text-red-500 text-center font-semibold">{errorMessage}</p>;
  }

  // Agrupando dados por tipo de ruído
  const dadosPorTipoRuido = dados.reduce((acc, item) => {
    (acc[item.tipo_ruido] = acc[item.tipo_ruido] || []).push(item);
    return acc;
  }, {} as Record<string, any[]>);

  const tiposRuido = Object.keys(dadosPorTipoRuido);

  const gerarExcel = () => {
    let dadosParaExcel;
    if (visualizacaoCompleta) {
      dadosParaExcel = dados;
    } else if (tipoRuidoSelecionado) {
      dadosParaExcel = dadosPorTipoRuido[tipoRuidoSelecionado];
    } else {
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dadosParaExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `dados_${visualizacaoCompleta ? 'completos' : tipoRuidoSelecionado}.xlsx`);
  };

  const renderizarListaDados = (dadosParaExibir: any[]) => (
    <ul className="space-y-4">
      {dadosParaExibir.map((item: any, index: number) => (
        <li
          key={index}
          className="p-4 bg-white border border-gray-300 rounded-lg shadow-md transition-transform transform hover:shadow-xl hover:bg-gray-100 cursor-pointer"
          onClick={() => router.push(`/Audios/details?id=${item.id}`)}
        >
          <div className="flex flex-col">
            <p className="font-medium text-gray-800">
              <span className="font-semibold text-gray-600">ID:</span> {item.id}
            </p>
            <p className="font-medium text-gray-800">
              <span className="font-semibold text-gray-600">Data Identificação:</span> {item.data_identificacao}
            </p>
            <p className="font-medium text-gray-800">
              <span className="font-semibold text-gray-600">Horário Identificação:</span> {item.horario_identificacao}
            </p>
            <p className="font-medium text-gray-800">
              <span className="font-semibold text-gray-600">Nome do Áudio:</span> {item.nome_audio}
            </p>
            <p className="font-medium text-gray-800">
              <span className="font-semibold text-gray-600">Tempo de Resposta:</span> {item.tempo_resposta}
            </p>
            <p className="font-medium text-gray-800">
              <span className="font-semibold text-gray-600">Tipo de Ruído:</span> {item.tipo_ruido}
            </p>
          </div>
          <hr className="my-2 border-gray-300" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="container mx-auto px-6 py-12 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Dados Obtidos</h2>

      <div className="mb-6">
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => {
              setVisualizacaoCompleta(false);
              setTipoRuidoSelecionado(null);
            }}
            className={`px-4 py-2 rounded-lg ${!visualizacaoCompleta && !tipoRuidoSelecionado ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Selecionar Tipo
          </button>
          <button
            onClick={() => {
              setVisualizacaoCompleta(true);
              setTipoRuidoSelecionado(null);
            }}
            className={`px-4 py-2 rounded-lg ${visualizacaoCompleta ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Todos os Dados
          </button>
        </div>

        {!visualizacaoCompleta && (
          <div className="flex justify-center space-x-4">
            {tiposRuido.map((tipoRuido) => (
              <button
                key={tipoRuido}
                onClick={() => setTipoRuidoSelecionado(tipoRuido)}
                className={`px-4 py-2 rounded-lg ${tipoRuidoSelecionado === tipoRuido ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {tipoRuido}
              </button>
            ))}
          </div>
        )}
      </div>

      {visualizacaoCompleta ? (
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Todos os Dados</h3>
          {renderizarListaDados(dados)}
          <button
            onClick={gerarExcel}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Gerar Excel Completo
          </button>
        </div>
      ) : (
        tipoRuidoSelecionado && (
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{tipoRuidoSelecionado}</h3>
            {dadosPorTipoRuido[tipoRuidoSelecionado]?.length === 0 ? (
              <p className="text-center text-lg text-gray-600">Nenhum dado encontrado para o tipo de ruído selecionado.</p>
            ) : (
              <>
                {renderizarListaDados(dadosPorTipoRuido[tipoRuidoSelecionado])}
                <button
                  onClick={gerarExcel}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  Gerar Excel
                </button>
              </>
            )}
          </div>
        )
      )}
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Marcelitos dev Enterprise. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default ConsumirDados;

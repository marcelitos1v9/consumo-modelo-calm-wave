import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import XLSX from 'xlsx';

const ConsumirDados = () => {
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tipoRuidoSelecionado, setTipoRuidoSelecionado] = useState<string | null>(null);

  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true); // Adicionando loading antes da requisição
      try {
        const response = await fetch('http://10.67.56.156:5000/ia/datas');
        if (!response.ok) {
          throw new Error(`Erro ao buscar os dados: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.length === 0) {
          setErrorMessage('Nenhum dado encontrado.');
        } else {
          setDados(data);
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
    if (!tipoRuidoSelecionado) return;

    const dadosSelecionados = dadosPorTipoRuido[tipoRuidoSelecionado];
    const worksheet = XLSX.utils.json_to_sheet(dadosSelecionados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, tipoRuidoSelecionado);
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); // Corrigindo o tipo
    saveAs(data, `${tipoRuidoSelecionado}.xlsx`);
  };

  return (
    <div className="container mx-auto px-6 py-12 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Dados Obtidos</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Selecione o Tipo de Ruído:</h3>
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
      </div>

      {tipoRuidoSelecionado && dadosPorTipoRuido[tipoRuidoSelecionado]?.length === 0 ? (
        <p className="text-center text-lg text-gray-600">Nenhum dado encontrado para o tipo de ruído selecionado.</p>
      ) : (
        tipoRuidoSelecionado && (
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{tipoRuidoSelecionado}</h3>
            <ul className="space-y-4">
              {dadosPorTipoRuido[tipoRuidoSelecionado].map((item: any, index: number) => (
                <li
                  key={index}
                  className="p-4 bg-white border border-gray-300 rounded-lg shadow-md transition-transform transform hover:shadow-xl hover:bg-gray-100"
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
            <button
              onClick={gerarExcel}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Gerar Excel
            </button>
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

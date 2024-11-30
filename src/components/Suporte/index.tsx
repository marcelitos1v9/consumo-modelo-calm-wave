import React, { useState } from 'react';
import Header from '../Header';

export default function Suporte() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    descricao: '',
    prioridade: 'baixa'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica de envio do formulário
    console.log('Dados do formulário:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Suporte Técnico</h1>
          
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="transform hover:scale-105 transition-all duration-300">
                <label htmlFor="nome" className="block text-sm font-medium text-gray-300">
                  Nome
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  required
                />
              </div>

              <div className="transform hover:scale-105 transition-all duration-300">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  required
                />
              </div>

              <div className="transform hover:scale-105 transition-all duration-300">
                <label htmlFor="assunto" className="block text-sm font-medium text-gray-300">
                  Assunto
                </label>
                <input
                  type="text"
                  id="assunto"
                  name="assunto"
                  value={formData.assunto}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  required
                />
              </div>

              <div className="transform hover:scale-105 transition-all duration-300">
                <label htmlFor="prioridade" className="block text-sm font-medium text-gray-300">
                  Prioridade
                </label>
                <select
                  id="prioridade"
                  name="prioridade"
                  value={formData.prioridade}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div className="transform hover:scale-105 transition-all duration-300">
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-300">
                  Descrição do Problema
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-300"
              >
                Enviar Solicitação
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

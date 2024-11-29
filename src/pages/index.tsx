import React from "react";
import Header from "@/components/Header";
import AudioList from "@/components/AudioList";

interface ActionCardProps {
  title: string;
  description: string; 
  link: string;
  icon: string;
}

export default function Home() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Bem-vindo ao Calm Wave
          </h1>
        </div>

        {/* Cards de Ação Rápida */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <ActionCard
            title="Analisar Novo Áudio"
            description="Upload e análise de novos arquivos de áudio"
            link="/Audios/Analisar-audio"
            icon="🎵"
          />
          <ActionCard
            title="Visualizar Análises"
            description="Lista completa de áudios analisados"
            link="/Audios/lista"
            icon="📊"
          />
          <ActionCard
            title="Dashboard"
            description="Estatísticas e métricas gerais"
            link="/dashboard"
            icon="📈"
          />
        </div>
      </main>
    </div>
  );
}

const ActionCard = ({ title, description, link, icon }: ActionCardProps) => (
  <a
    href={link}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{title}</h2>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </a>
);

import { useState, useEffect } from "react";

export default function Webapplication() {
  const [isLogin, setIsLogin] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detecta se é dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Botão Voltar */}
      <button
        onClick={() => window.history.back()}
        className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-300 z-30 flex items-center gap-2"
        aria-label="Voltar para página anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Voltar</span>
      </button>

      <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-900 relative overflow-hidden p-4">
        {/* Ondas de áudio animadas - Ocultas em mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block" aria-hidden="true">
          <div className="absolute bottom-0 left-0 w-full h-64 flex items-end">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div
                key={i}
                className="flex-1 mx-0.5"
                style={{
                  transform: `translateX(${i * 50}px)`
                }}
              >
                <div
                  className={`bg-gradient-to-t from-purple-500/30 to-blue-500/30 rounded-t-lg animate-wave-${i}`}
                  style={{
                    height: `${Math.sin(i/2) * 100 + 100}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Container para o fone e efeitos - Ajustado para mobile */}
        <div className={`${isMobile ? 'relative mb-8' : 'absolute left-[15%]'} flex items-center z-10`}>
          <div className="relative transform hover:scale-105 transition-transform duration-300">
            <img
              src="/icons/fone.png" 
              alt="Fone de ouvido decorativo"
              className={`${isMobile ? 'w-32' : 'w-96'} h-auto z-10 relative animate-float`}
            />
          </div>
        </div>

        {/* Container do formulário - Responsivo */}
        <div className="bg-[#010101] p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md mx-auto md:ml-auto md:mr-20 backdrop-blur-lg bg-opacity-90 hover:shadow-2xl transition-all duration-300 z-20">
          <div className="flex justify-center mb-6 md:mb-8 transform hover:scale-110 transition-transform duration-300">
            <img
              src="icons/logo_sem_nome.png"
              alt="Logo Calm Wave"
              className="w-16 md:w-20 h-auto"
            />
          </div>
          <h2 className="text-xl md:text-2xl text-white font-bold text-center mb-6 animate-fade-in" role="heading" aria-level={1}>
            {isLogin ? 'Login' : 'Registrar'}
          </h2>
          <form className="space-y-4 md:space-y-6" noValidate>
            <div className="transform hover:scale-105 transition-all duration-300">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                aria-required="true"
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                placeholder="seu@email.com"
                autoComplete="email"
              />
            </div>
            {!isLogin && (
              <div className="transform hover:scale-105 transition-all duration-300">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  aria-required="true"
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  placeholder="Seu nome"
                  autoComplete="name"
                />
              </div>
            )}
            <div className="transform hover:scale-105 transition-all duration-300">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                aria-required="true"
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                placeholder="********"
                autoComplete={isLogin ? "current-password" : "new-password"}
                minLength={8}
              />
            </div>
            {!isLogin && (
              <div className="transform hover:scale-105 transition-all duration-300">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  aria-required="true"
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  placeholder="********"
                  autoComplete="new-password"
                  minLength={8}
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-300"
              aria-label={isLogin ? "Fazer login" : "Criar conta"}
            >
              {isLogin ? 'Entrar' : 'Registrar'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-400">
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 hover:text-blue-400 transition-colors duration-300 focus:outline-none focus:underline"
              aria-label={isLogin ? "Alternar para tela de registro" : "Alternar para tela de login"}
            >
              {isLogin ? 'Registre-se' : 'Faça login'}
            </button>
          </p>
        </div>
      </div>

      {/* Estilos para as animações */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-float {
          animation: float 3s infinite ease-in-out;
        }

        @keyframes wave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(2); }
        }

        .animate-wave-1 { animation: wave 1.2s infinite ease-in-out; }
        .animate-wave-2 { animation: wave 1.4s infinite ease-in-out; }
        .animate-wave-3 { animation: wave 1.6s infinite ease-in-out; }
        .animate-wave-4 { animation: wave 1.8s infinite ease-in-out; }
        .animate-wave-5 { animation: wave 2.0s infinite ease-in-out; }
        .animate-wave-6 { animation: wave 2.2s infinite ease-in-out; }
        .animate-wave-7 { animation: wave 2.4s infinite ease-in-out; }
        .animate-wave-8 { animation: wave 2.6s infinite ease-in-out; }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-wave-1,
          .animate-wave-2,
          .animate-wave-3,
          .animate-wave-4,
          .animate-wave-5,
          .animate-wave-6,
          .animate-wave-7,
          .animate-wave-8,
          .animate-fade-in {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}

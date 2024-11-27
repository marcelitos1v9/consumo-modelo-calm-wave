import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <h1 className="text-white text-3xl font-extrabold tracking-wide">Calm Wave</h1>
        </Link>
        <nav>
          {/* <ul className="flex space-x-6 text-lg font-medium">
            <li>
              <Link href="/" className="text-white hover:text-purple-300 transition duration-300">
                Início
              </Link>
            </li>
            <li>
              <Link href="/Audios/Analisar-audio" className="text-white hover:text-purple-300 transition duration-300">
                Analisar Áudio
              </Link>
            </li>
            <li>
              <Link href="/Audios/lista" className="text-white hover:text-purple-300 transition duration-300">
                Áudios Analisados
              </Link>
            </li>
          </ul> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;

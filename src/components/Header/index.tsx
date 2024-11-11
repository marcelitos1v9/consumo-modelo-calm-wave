import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="flex items-center space-x-2">
          <h1 className="text-white text-3xl font-extrabold tracking-wide">Calm Wave</h1>
        </a>
        <nav>
          <ul className="flex space-x-6 text-lg font-medium">
            <li>
              <a href="/" className="text-white hover:text-purple-300 transition duration-300 ease-in-out">
                Home
              </a>
            </li>
            <li>
              <a href="/Audios/Analisar-audio" className="text-white hover:text-purple-300 transition duration-300 ease-in-out">
                Analisar Áudio
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

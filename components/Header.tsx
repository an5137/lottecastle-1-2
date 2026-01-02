
import React from 'react';

interface HeaderProps {
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, onToggleAdmin }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/5 py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-bold luxury-text tracking-widest gold-gradient uppercase">
            SAHWA LOTTE CASTLE FOREST
          </h1>
          <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-[0.2em] font-light">
            Premium Real Estate Experience Platform
          </p>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-[10px] text-[#c5a059] font-bold">Authorized</span>
                <span className="text-[9px] text-gray-500">Admin Session</span>
              </div>
              <button 
                onClick={onToggleAdmin}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/50 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                <span className="text-xs font-bold">로그아웃</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={onToggleAdmin}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-700 text-gray-400 hover:text-white hover:border-[#c5a059] hover:bg-[#c5a059]/10 transition-all duration-300"
            >
              <i className="fa-solid fa-gear"></i>
              <span className="text-xs font-medium">관리자</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

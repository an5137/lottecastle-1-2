
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-20 glass-panel border-t border-white/5 py-12 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold luxury-text gold-gradient">LOTTE REAL ESTATE</h2>
            <p className="text-xs text-gray-500 tracking-wider">롯데부동산 공인중개사 사무소</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">대표 공인중개사</p>
              <p className="text-lg font-bold text-white">안정은 소장</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">등록번호</p>
              <p className="text-sm font-medium text-gray-300">제 가4376-0158호</p>
            </div>
          </div>

          <div className="flex gap-4">
             <a href="tel:01051373189" className="flex-1 gold-bg text-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 font-bold shadow-xl hover:scale-105 transition-all">
                <i className="fa-solid fa-phone-volume"></i>
                010-5137-3189
             </a>
             <button className="w-14 h-14 glass-panel rounded-2xl flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <i className="fa-solid fa-location-dot text-xl"></i>
             </button>
          </div>
        </div>

        <div className="flex flex-col justify-end text-left md:text-right space-y-4">
           <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">창원 사화 롯데캐슬 포레스트</h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-md md:ml-auto">
                본 플랫폼은 창원 사화 롯데캐슬 포레스트의 매물 정보와 공간 이미지를 전문적으로 제공하며, 
                IndexedDB를 통한 고화질 이미지 아카이빙 시스템을 구축하고 있습니다.
              </p>
           </div>
           <p className="text-[10px] text-gray-700">© 2024 LOTTE REAL ESTATE AGENT. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

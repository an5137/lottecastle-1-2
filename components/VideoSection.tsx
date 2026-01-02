
import React, { useState, useMemo } from 'react';
import { PropertyVideo, VideoCategory } from '../types';
import { VIDEO_CATEGORIES } from '../constants';

interface VideoSectionProps {
  videos: PropertyVideo[];
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

const VideoSection: React.FC<VideoSectionProps> = ({ videos, isAdmin, onDelete }) => {
  const [filterCategory, setFilterCategory] = useState<VideoCategory | '전체'>('전체');

  const filteredVideos = useMemo(() => {
    return videos.filter(v => filterCategory === '전체' || v.category === filterCategory);
  }, [videos, filterCategory]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass-panel p-6 rounded-3xl flex flex-wrap gap-3 justify-center shadow-xl">
        <button 
          onClick={() => setFilterCategory('전체')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filterCategory === '전체' ? 'gold-bg text-black font-bold shadow-lg' : 'bg-white/5 text-gray-400 hover:text-white'}`}
        >
          전체 보기
        </button>
        {VIDEO_CATEGORIES.map(c => (
          <button 
            key={c}
            onClick={() => setFilterCategory(c)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filterCategory === c ? 'gold-bg text-black font-bold shadow-lg' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((vid) => (
            <div key={vid.id} className="glass-panel rounded-3xl overflow-hidden group shadow-xl">
              <div className="relative aspect-video">
                <iframe 
                  className="w-full h-full"
                  src={vid.youtubeUrl}
                  title={vid.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6 space-y-2">
                <span className="text-[10px] text-[#c5a059] font-bold uppercase tracking-widest">{vid.category}</span>
                <h3 className="text-lg font-bold text-white group-hover:gold-gradient transition-all">{vid.title}</h3>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 flex flex-col items-center justify-center glass-panel rounded-3xl opacity-50">
            <i className="fa-brands fa-youtube text-6xl mb-4 text-gray-600"></i>
            <p className="text-xl font-light">등록된 영상 투어가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoSection;

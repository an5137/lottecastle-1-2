
import React, { useState, useMemo } from 'react';
import { PropertyImage, Complex, UnitType, PhotoZone } from '../types';
import { COMPLEXES, UNIT_TYPES, PHOTO_ZONES } from '../constants';

interface GalleryProps {
  images: PropertyImage[];
  selectedImageIds: string[];
  onSelect: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ images, selectedImageIds, onSelect }) => {
  const [filterComplex, setFilterComplex] = useState<Complex | '전체'>('전체');
  const [filterType, setFilterType] = useState<UnitType | '전체'>('전체');
  const [filterZone, setFilterZone] = useState<PhotoZone | '전체'>('전체');

  const filteredImages = useMemo(() => {
    return images.filter(img => {
      const matchComplex = filterComplex === '전체' || img.complex === filterComplex;
      const matchType = filterType === '전체' || img.unitType === filterType;
      const matchZone = filterZone === '전체' || img.photoZone === filterZone;
      return matchComplex && matchType && matchZone;
    });
  }, [images, filterComplex, filterType, filterZone]);

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider ml-2">단지 분류</label>
            <div className="flex flex-wrap gap-2">
              <FilterButton label="전체" active={filterComplex === '전체'} onClick={() => setFilterComplex('전체')} />
              {COMPLEXES.map(c => (
                <FilterButton key={c} label={c} active={filterComplex === c} onClick={() => setFilterComplex(c)} />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider ml-2">타입 분류</label>
            <div className="flex flex-wrap gap-2">
              <FilterButton label="전체" active={filterType === '전체'} onClick={() => setFilterType('전체')} />
              {UNIT_TYPES.map(t => (
                <FilterButton key={t} label={t} active={filterType === t} onClick={() => setFilterType(t)} />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider ml-2">공간 분류</label>
            <div className="flex flex-wrap gap-2 h-24 overflow-y-auto scrollbar-hide pr-2">
              <FilterButton label="전체" active={filterZone === '전체'} onClick={() => setFilterZone('전체')} />
              {PHOTO_ZONES.map(z => (
                <FilterButton key={z} label={z} active={filterZone === z} onClick={() => setFilterZone(z)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-40">
        {filteredImages.length > 0 ? (
          filteredImages.map((img) => (
            <div 
              key={img.id}
              className={`group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 shadow-lg ${selectedImageIds.includes(img.id) ? 'ring-4 ring-[#c5a059] ring-offset-4 ring-offset-[#0f1115] scale-95' : 'hover:scale-105 hover:shadow-2xl'}`}
              onClick={() => onSelect(img.id)}
            >
              <img 
                src={img.imageUrl} 
                alt={`${img.unitType} ${img.photoZone}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              
              {/* Image Info */}
              <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] bg-[#c5a059] text-black px-1.5 py-0.5 rounded-sm font-bold uppercase">{img.complex}</span>
                  <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-sm font-medium">{img.unitType}</span>
                </div>
                <p className="text-sm font-bold tracking-tight">{img.photoZone}</p>
              </div>

              {/* Selection Badge */}
              {selectedImageIds.includes(img.id) && (
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full gold-bg text-black flex items-center justify-center shadow-lg animate-scale-in">
                  <span className="font-bold text-sm">
                    {selectedImageIds.indexOf(img.id) + 1}
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 flex flex-col items-center justify-center glass-panel rounded-3xl opacity-50">
            <i className="fa-solid fa-camera-rotate text-5xl mb-4 text-gray-600"></i>
            <p className="text-xl font-light">선택한 조건의 사진이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const FilterButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${active ? 'gold-bg text-black shadow-lg font-bold' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
  >
    {label}
  </button>
);

export default Gallery;

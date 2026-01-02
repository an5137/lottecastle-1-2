
import React from 'react';
import { PropertyImage } from '../types';

// Cast the custom web component name to avoid JSX intrinsic element type errors
const ImgComparisonSlider = 'img-comparison-slider' as any;

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  image1: PropertyImage | null;
  image2: PropertyImage | null;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose, image1, image2 }) => {
  if (!isOpen || !image1 || !image2) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-6xl aspect-[4/3] md:aspect-video glass-panel rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 animate-scale-in">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#c5a059] font-bold uppercase tracking-widest">Left Image</span>
              <h3 className="text-xl font-bold text-white leading-none">
                {image1.unitType} <span className="text-[#c5a059]">•</span> {image1.photoZone}
              </h3>
            </div>
            <div className="hidden md:block w-[1px] h-8 bg-white/20" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Right Image</span>
              <h3 className="text-xl font-bold text-white leading-none opacity-80">
                {image2.unitType} <span className="text-gray-500">•</span> {image2.photoZone}
              </h3>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors shadow-xl"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Comparison Area */}
        <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden">
          <ImgComparisonSlider className="w-full h-full">
            <img slot="first" src={image1.imageUrl} alt="Before" className="w-full h-full object-cover" />
            <img slot="second" src={image2.imageUrl} alt="After" className="w-full h-full object-cover" />
            <div slot="handle" className="relative h-full flex items-center justify-center">
               <div className="w-[3px] h-full bg-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.8)]"></div>
               <div className="absolute w-12 h-12 rounded-full gold-bg flex items-center justify-center shadow-2xl border-4 border-[#0f1115]">
                  <i className="fa-solid fa-arrows-left-right text-black text-sm"></i>
               </div>
            </div>
          </ImgComparisonSlider>
        </div>

        {/* Labels Overlay */}
        <div className="absolute bottom-8 left-8 z-10 px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/5">
          <p className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.2em]">Comparison Mode</p>
        </div>
        <div className="absolute bottom-8 right-8 z-10 px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/5 text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Drag Slider to Compare</p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;

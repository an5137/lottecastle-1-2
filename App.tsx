
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PropertyImage, PropertyVideo, Complex, UnitType, PhotoZone, VideoCategory } from './types';
import { getAllImages, saveImage, deleteImageFromDB, getAllVideos, saveVideo, deleteVideoFromDB } from './db';
import Header from './components/Header';
import Gallery from './components/Gallery';
import AdminPanel from './components/AdminPanel';
import ComparisonModal from './components/ComparisonModal';
import VideoSection from './components/VideoSection';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [videos, setVideos] = useState<PropertyVideo[]>([]);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');

  // 데이터 로드 함수
  const loadInitialData = async () => {
    try {
      const [dbImages, dbVideos] = await Promise.all([getAllImages(), getAllVideos()]);
      setImages(dbImages.sort((a, b) => b.createdAt - a.createdAt));
      setVideos(dbVideos);
    } catch (err) {
      console.error("데이터 로드 중 오류:", err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleToggleAdmin = () => {
    if (isAdmin) {
      if (confirm('로그아웃 하시겠습니까?')) {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(true);
    }
  };

  const handleSelectImage = (id: string) => {
    setSelectedImageIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  // 이미지 업로드 및 교체(수정) 처리
  const handleUploadImage = async (newImg: PropertyImage) => {
    try {
      await saveImage(newImg);
      setImages(prev => {
        const index = prev.findIndex(img => img.id === newImg.id);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = newImg;
          return updated;
        }
        return [newImg, ...prev];
      });
      return true;
    } catch (err) {
      console.error("저장 실패:", err);
      alert("이미지 저장에 실패했습니다.");
      return false;
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('이 사진을 영구적으로 삭제하시겠습니까?')) return;
    try {
      await deleteImageFromDB(id);
      setImages(prev => prev.filter(img => img.id !== id));
      setSelectedImageIds(prev => prev.filter(sid => sid !== id));
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleUploadVideo = async (newVid: PropertyVideo) => {
    try {
      await saveVideo(newVid);
      setVideos(prev => {
        const index = prev.findIndex(v => v.id === newVid.id);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = newVid;
          return updated;
        }
        return [...prev, newVid];
      });
    } catch (err) {
      alert("영상 저장 실패");
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('정말 이 영상을 삭제하시겠습니까?')) return;
    try {
      await deleteVideoFromDB(id);
      setVideos(prev => prev.filter(vid => vid.id !== id));
    } catch (err) {
      alert("영상 삭제 실패");
    }
  };

  // 데이터 내보내기 (.txt 파일 생성으로 모바일 호환성 확보)
  const handleExportData = () => {
    const data = {
      images,
      videos,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // .txt로 저장하여 카톡에서 파일 다운로드가 원활하게 함
    link.download = `lotte_backup_${new Date().toLocaleDateString().replace(/\./g, '')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    alert('데이터 백업 파일(.txt)이 생성되었습니다. 카카오톡으로 전송하여 모바일에서 사용하세요.');
  };

  // 데이터 가져오기 (.txt 파일 읽기)
  const handleImportData = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (!data.images || !data.videos) throw new Error("유효하지 않은 데이터 구조입니다.");

        if (!confirm(`${data.images.length}개의 사진과 ${data.videos.length}개의 영상을 현재 기기로 가져오시겠습니까?`)) return;

        // DB 순차 저장
        for (const img of data.images) await saveImage(img);
        for (const vid of data.videos) await saveVideo(vid);

        await loadInitialData();
        alert("모든 데이터가 성공적으로 동기화되었습니다.");
      } catch (err) {
        console.error("Import error:", err);
        alert("데이터 가져오기에 실패했습니다. 올바른 백업(.txt) 파일인지 확인해주세요.");
      }
    };
    reader.readAsText(file);
  };

  const selectedImages = useMemo(() => 
    images.filter(img => selectedImageIds.includes(img.id)),
  [images, selectedImageIds]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115]">
      <Header isAdmin={isAdmin} onToggleAdmin={handleToggleAdmin} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 glass-panel rounded-full overflow-hidden shadow-2xl border border-white/5">
            <button 
              onClick={() => setActiveTab('images')}
              className={`px-8 py-2.5 rounded-full transition-all duration-300 text-sm font-bold tracking-tight ${activeTab === 'images' ? 'gold-bg text-black shadow-lg scale-105' : 'text-gray-400 hover:text-white'}`}
            >
              <i className="fa-solid fa-images mr-2"></i>
              공간 이미지
            </button>
            <button 
              onClick={() => setActiveTab('videos')}
              className={`px-8 py-2.5 rounded-full transition-all duration-300 text-sm font-bold tracking-tight ${activeTab === 'videos' ? 'gold-bg text-black shadow-lg scale-105' : 'text-gray-400 hover:text-white'}`}
            >
              <i className="fa-solid fa-circle-play mr-2"></i>
              영상 투어
            </button>
          </div>
        </div>

        {activeTab === 'images' ? (
          <Gallery 
            images={images} 
            selectedImageIds={selectedImageIds} 
            onSelect={handleSelectImage}
          />
        ) : (
          <VideoSection 
            videos={videos}
            isAdmin={isAdmin}
            onDelete={handleDeleteVideo}
          />
        )}
      </main>

      {/* Floating Selection Bar */}
      {selectedImageIds.length > 0 && activeTab === 'images' && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4 animate-bounce-in">
          <div className="glass-panel p-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between border-2 border-[#c5a059]/30">
            <div className="flex -space-x-3">
              {selectedImages.map((img, idx) => (
                <div key={img.id} className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden border-2 border-[#c5a059] shadow-lg transform hover:scale-110 transition-transform">
                  <img src={img.imageUrl} alt="selected" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 right-0 bg-[#c5a059] text-black text-[9px] px-1 font-bold rounded-tl-md">
                    {idx + 1}
                  </div>
                </div>
              ))}
              {selectedImageIds.length === 1 && (
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-600 bg-gray-900/50">
                  <i className="fa-solid fa-plus text-lg animate-pulse"></i>
                </div>
              )}
            </div>
            
            <div className="flex-1 px-4">
              <p className="text-xs md:text-sm font-bold text-white">
                {selectedImageIds.length === 2 ? '공간 비교 분석 준비 완료' : '비교할 사진을 하나 더 선택하세요'}
              </p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedImageIds([])}
                className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                <i className="fa-solid fa-rotate-left"></i>
              </button>
              <button 
                disabled={selectedImageIds.length !== 2}
                onClick={() => setIsComparisonOpen(true)}
                className={`px-4 md:px-6 h-10 rounded-full font-bold transition-all duration-300 ${selectedImageIds.length === 2 ? 'gold-bg text-black shadow-lg hover:scale-105 active:scale-95' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
              >
                비교
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <AdminPanel 
          onUploadImage={handleUploadImage}
          onUploadVideo={handleUploadVideo}
          onDeleteImage={handleDeleteImage}
          onDeleteVideo={handleDeleteVideo}
          onExport={handleExportData}
          onImport={handleImportData}
          images={images}
          videos={videos}
        />
      )}

      <ComparisonModal 
        isOpen={isComparisonOpen} 
        onClose={() => setIsComparisonOpen(false)} 
        image1={selectedImages[0]}
        image2={selectedImages[1]}
      />
      
      <Footer />
    </div>
  );
};

export default App;

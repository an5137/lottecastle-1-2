
import React, { useState, useEffect } from 'react';
import { PropertyImage, PropertyVideo, Complex, UnitType, PhotoZone, VideoCategory } from '../types';
import { COMPLEXES, UNIT_TYPES, PHOTO_ZONES, VIDEO_CATEGORIES, ADMIN_PASSWORD } from '../constants';

interface AdminPanelProps {
  onUploadImage: (img: PropertyImage) => Promise<boolean>;
  onUploadVideo: (vid: PropertyVideo) => void;
  onDeleteImage: (id: string) => void;
  onDeleteVideo: (id: string) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  images: PropertyImage[];
  videos: PropertyVideo[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onUploadImage, onUploadVideo, onDeleteImage, onDeleteVideo, onExport, onImport, images, videos }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const [storageUsed, setStorageUsed] = useState<string>('0');
  const [activeTab, setActiveTab] = useState<'upload_image' | 'upload_video' | 'manage'>('upload_image');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [imgComplex, setImgComplex] = useState<Complex>('1단지');
  const [imgType, setImgType] = useState<UnitType>('34A타입');
  const [imgZone, setImgZone] = useState<PhotoZone>('거실');
  const [imgFile, setImgFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [vidCategory, setVidCategory] = useState<VideoCategory>('1단지');
  const [vidTitle, setVidTitle] = useState('');
  const [vidUrl, setVidUrl] = useState('');

  const updateStorageEstimate = async () => {
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        const used = estimate.usage || 0;
        setStorageUsed((used / (1024 * 1024)).toFixed(1));
      } catch (e) { console.error("Storage Stats Error:", e); }
    }
  };

  useEffect(() => {
    if (isOpen) updateStorageEstimate();
  }, [isOpen, images]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) setIsAuthenticated(true);
    else alert('비밀번호가 틀렸습니다.');
  };

  const processImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200; 
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
      };
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      try {
        const compressed = await processImage(file);
        setImgFile(compressed);
      } catch (err) {
        alert("이미지 처리 중 오류가 발생했습니다.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const submitImage = async () => {
    if (!imgFile) return alert('이미지를 선택해주세요.');
    setIsProcessing(true);
    const imagePayload: PropertyImage = {
      id: editingId || crypto.randomUUID(),
      complex: imgComplex,
      unitType: imgType,
      photoZone: imgZone,
      imageUrl: imgFile,
      createdAt: Date.now()
    };
    const success = await onUploadImage(imagePayload);
    if (success) { 
      resetImageForm(); 
      setActiveTab('manage'); 
      alert(editingId ? '이미지가 교체되었습니다.' : '이미지가 등록되었습니다.');
    }
    setIsProcessing(false);
  };

  const resetImageForm = () => {
    setEditingId(null); setImgFile(null); setImgComplex('1단지'); setImgType('34A타입'); setImgZone('거실');
  };

  const handleStartEdit = (img: PropertyImage, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(img.id); setImgComplex(img.complex); setImgType(img.unitType); setImgZone(img.photoZone); setImgFile(img.imageUrl);
    setActiveTab('upload_image');
  };

  const submitVideo = () => {
    if (!vidTitle || !vidUrl) return alert('모든 항목을 입력해주세요.');
    const videoId = vidUrl.split('v=')[1]?.split('&')[0] || vidUrl.split('be/')[1];
    if (!videoId) return alert('유효한 유튜브 URL이 아닙니다.');
    onUploadVideo({
      id: crypto.randomUUID(),
      category: vidCategory,
      title: vidTitle,
      youtubeUrl: `https://www.youtube.com/embed/${videoId}`
    });
    setVidTitle(''); setVidUrl('');
    alert('영상이 등록되었습니다.');
    setActiveTab('manage');
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-8 w-14 h-14 gold-bg text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 animate-pulse border-4 border-black/20"
      >
        <i className="fa-solid fa-screwdriver-wrench text-xl"></i>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-0 md:p-8">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
      
      <div className="relative w-full h-full md:h-auto max-w-5xl glass-panel md:rounded-3xl shadow-2xl overflow-hidden animate-slide-up md:animate-scale-in max-h-[100vh] md:max-h-[90vh] flex flex-col border border-white/10">
        {!isAuthenticated ? (
          <div className="p-12 text-center space-y-6 flex flex-col justify-center h-full">
            <h2 className="text-2xl font-bold luxury-text gold-gradient tracking-widest uppercase">Admin Verification</h2>
            <form onSubmit={handleAuth} className="space-y-4 max-w-xs mx-auto">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-center text-xl tracking-widest focus:outline-none focus:border-[#c5a059]"
                placeholder="****"
              />
              <button className="w-full gold-bg text-black py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg">인증하기</button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-white/5 shrink-0">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-screwdriver-wrench text-[#c5a059]"></i>
                <h2 className="text-lg md:text-xl font-bold luxury-text gold-gradient uppercase tracking-widest">Management</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 overflow-x-auto scrollbar-hide shrink-0 bg-black/20">
              <button onClick={() => { setActiveTab('upload_image'); resetImageForm(); }} className={`flex-1 min-w-[100px] py-4 text-[10px] md:text-xs font-bold transition-all uppercase tracking-tighter ${activeTab === 'upload_image' ? 'text-[#c5a059] border-b-2 border-[#c5a059] bg-[#c5a059]/5' : 'text-gray-500 hover:text-gray-300'}`}>이미지 업로드</button>
              <button onClick={() => setActiveTab('upload_video')} className={`flex-1 min-w-[100px] py-4 text-[10px] md:text-xs font-bold transition-all uppercase tracking-tighter ${activeTab === 'upload_video' ? 'text-[#c5a059] border-b-2 border-[#c5a059] bg-[#c5a059]/5' : 'text-gray-500 hover:text-gray-300'}`}>영상 등록</button>
              <button onClick={() => setActiveTab('manage')} className={`flex-1 min-w-[100px] py-4 text-[10px] md:text-xs font-bold transition-all uppercase tracking-tighter ${activeTab === 'manage' ? 'text-[#c5a059] border-b-2 border-[#c5a059] bg-[#c5a059]/5' : 'text-gray-500 hover:text-gray-300'}`}>전체 관리</button>
            </div>

            {/* Main Content Area */}
            <div className="p-4 md:p-8 overflow-y-auto space-y-6 flex-grow scrollbar-hide pb-24 md:pb-8">
              {activeTab === 'upload_image' && (
                <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
                  {editingId && <div className="p-4 bg-[#c5a059]/10 border border-[#c5a059]/40 rounded-2xl flex items-center justify-between shadow-2xl animate-pulse"><div className="flex items-center gap-3 text-sm text-[#c5a059] font-bold"><i className="fa-solid fa-rotate"></i><span>교체 모드 활성</span></div><button onClick={resetImageForm} className="text-[10px] text-gray-500 hover:text-white underline uppercase font-bold">취소</button></div>}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">단지</label><select value={imgComplex} onChange={(e) => setImgComplex(e.target.value as Complex)} className="admin-input">{COMPLEXES.map(c => <option key={c} value={c} className="bg-[#1a1c21]">{c}</option>)}</select></div>
                    <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">타입</label><select value={imgType} onChange={(e) => setImgType(e.target.value as UnitType)} className="admin-input">{UNIT_TYPES.map(t => <option key={t} value={t} className="bg-[#1a1c21]">{t}</option>)}</select></div>
                    <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">공간</label><select value={imgZone} onChange={(e) => setImgZone(e.target.value as PhotoZone)} className="admin-input">{PHOTO_ZONES.map(z => <option key={z} value={z} className="bg-[#1a1c21]">{z}</option>)}</select></div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">사진 데이터</label>
                    <div className="relative group border-2 border-dashed border-white/10 rounded-2xl h-56 md:h-80 flex flex-col items-center justify-center overflow-hidden hover:border-[#c5a059]/50 transition-colors bg-white/5">
                      {imgFile ? <><img src={imgFile} className="w-full h-full object-contain" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><p className="text-white text-xs font-bold">클릭하여 이미지 교체</p></div></> : <div className="text-center"><i className={`fa-solid ${isProcessing ? 'fa-spinner fa-spin' : 'fa-cloud-arrow-up'} text-5xl text-gray-600 mb-4 group-hover:text-[#c5a059]`}></i><p className="text-sm text-gray-400 font-bold">{isProcessing ? '처리 중...' : '이미지 선택하기'}</p></div>}
                      <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" disabled={isProcessing} />
                    </div>
                  </div>
                  {/* Desktop Only Button (hidden on mobile) */}
                  <div className="hidden md:block">
                    <button onClick={submitImage} disabled={isProcessing} className="w-full gold-bg text-black py-5 rounded-xl font-black shadow-xl uppercase tracking-widest transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50">
                      {editingId ? '기존 이미지 교체 완료' : '신규 이미지 등록'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'manage' && (
                <div className="space-y-8 animate-fade-in pb-10">
                  <div className="p-6 bg-[#c5a059]/5 border border-[#c5a059]/30 rounded-3xl space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl gold-bg flex items-center justify-center shadow-lg">
                        <i className="fa-solid fa-sync text-black"></i>
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">기기 간 데이터 동기화 (Sync)</h3>
                        <p className="text-[10px] text-[#c5a059] font-bold">컴퓨터와 모바일 간 데이터 공유 가이드</p>
                      </div>
                    </div>
                    
                    <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-2">
                       <p className="text-[11px] text-gray-300 flex gap-2"><span className="text-[#c5a059] font-black">STEP 1.</span> PC 관리자에서 '데이터 내보내기' 클릭</p>
                       <p className="text-[11px] text-gray-300 flex gap-2"><span className="text-[#c5a059] font-black">STEP 2.</span> 생성된 파일을 본인 카톡으로 전송</p>
                       <p className="text-[11px] text-gray-300 flex gap-2"><span className="text-[#c5a059] font-black">STEP 3.</span> <span className="text-white underline font-bold">모바일에서 파일을 폰으로 다운로드(저장)</span></p>
                       <p className="text-[11px] text-gray-300 flex gap-2"><span className="text-[#c5a059] font-black">STEP 4.</span> 모바일에서 '가져오기' 클릭 후 해당 파일 선택</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button onClick={onExport} className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white py-4 rounded-xl hover:bg-white/10 transition-all font-black text-xs">
                        <i className="fa-solid fa-file-export text-[#c5a059]"></i>1. 데이터 내보내기 (.txt)
                      </button>
                      <div className="relative">
                        <button className="w-full flex items-center justify-center gap-3 gold-bg text-black py-4 rounded-xl transition-all font-black text-xs shadow-lg">
                          <i className="fa-solid fa-file-import"></i>2. 데이터 가져오기 (.txt)
                        </button>
                        <input type="file" accept=".txt" onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map(img => (
                      <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-white/5 bg-[#1a1c21] shadow-lg">
                        <img src={img.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2 text-[10px] pointer-events-none"><span className="block text-[#c5a059] font-bold">{img.unitType}</span><span className="block text-white truncate font-medium">{img.photoZone}</span></div>
                        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0"><button onClick={(e) => handleStartEdit(img, e)} className="w-9 h-9 rounded-lg bg-[#c5a059] text-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"><i className="fa-solid fa-rotate text-xs"></i></button></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'upload_video' && (
                <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
                  <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">카테고리</label><select value={vidCategory} onChange={(e) => setVidCategory(e.target.value as VideoCategory)} className="admin-input">{VIDEO_CATEGORIES.map(c => <option key={c} value={c} className="bg-[#1a1c21]">{c}</option>)}</select></div>
                  <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">영상 제목</label><input type="text" value={vidTitle} onChange={(e) => setVidTitle(e.target.value)} className="admin-input" placeholder="영상 제목 입력" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">유튜브 링크</label><input type="text" value={vidUrl} onChange={(e) => setVidUrl(e.target.value)} className="admin-input" placeholder="유튜브 URL" /></div>
                  <div className="hidden md:block">
                    <button onClick={submitVideo} className="w-full gold-bg text-black py-5 rounded-xl font-black shadow-xl uppercase tracking-widest transition-transform hover:scale-[1.01]">영상 데이터 등록 완료</button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Fixed Action Button (Always Visible) */}
            {(activeTab === 'upload_image' || activeTab === 'upload_video') && (
              <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-xl border-t border-white/10 z-[80] pb-safe">
                <button 
                  onClick={activeTab === 'upload_image' ? submitImage : submitVideo} 
                  disabled={isProcessing}
                  className="w-full gold-bg text-black py-4 rounded-xl font-black shadow-[0_0_30px_rgba(197,160,89,0.3)] uppercase tracking-widest active:scale-95 transition-transform"
                >
                  {isProcessing ? '처리 중...' : (editingId ? '교체 확인 및 저장' : '등록 확인 및 저장')}
                </button>
              </div>
            )}

            {/* Unlimited Archive Info Bar (Desktop Only) */}
            <div className="hidden md:block p-4 md:p-6 bg-black/60 border-t border-[#c5a059]/30 backdrop-blur-3xl shrink-0">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <i className="fa-solid fa-infinity text-xl text-[#c5a059]"></i>
                  <div className="flex flex-col"><h3 className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.3em]">Sync-Active Archive</h3><span className="text-xl md:text-2xl font-black text-white">{storageUsed} <span className="text-xs text-gray-500">MB</span></span></div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div className="flex flex-col items-end"><span className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Total Assets</span><span className="text-sm font-bold text-white">{images.length + videos.length} Units</span></div>
                  <div className="h-8 w-[1px] bg-white/10"></div>
                  <div className="flex flex-col items-end"><span className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Storage Status</span><span className="text-[10px] font-bold text-green-500 uppercase">Synced & Safe</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .admin-input { width: 100%; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 1rem; padding: 0.875rem 1.25rem; font-size: 0.875rem; color: white; outline: none; transition: all 0.3s; }
        .admin-input:focus { border-color: #c5a059; background: rgba(255, 255, 255, 0.08); }
        select.admin-input { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23c5a059'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; background-size: 0.8rem; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
    </div>
  );
};

export default AdminPanel;


export type Complex = '1단지' | '2단지';
export type UnitType = '34A타입' | '34B타입' | '34C타입' | '34D타입' | '41타입';
export type PhotoZone = 
  | '거실' | '주방' | '안방' | '작은방1' | '작은방2' | '작은방3' | '작은방4' 
  | '욕실(거실)' | '욕실(안방)' | '드레스룸' | '옵션' | '펜트리' | '알파룸' 
  | '파우더룸' | '세탁실' | '배란다' | '외부뷰1' | '외부뷰2' | '외부뷰3' 
  | '평면도' | '구조도' | '배치도' | '커뮤니티' | '단지뷰' | '기타';

export type VideoCategory = '1단지' | '2단지' | '실내' | '외부' | '커뮤니티' | '주변';

export interface PropertyImage {
  id: string;
  complex: Complex;
  unitType: UnitType;
  photoZone: PhotoZone;
  imageUrl: string; // Base64 for IndexedDB storage
  createdAt: number;
}

export interface PropertyVideo {
  id: string;
  category: VideoCategory;
  youtubeUrl: string;
  title: string;
}

export interface StorageStats {
  used: number;
  total: number;
}

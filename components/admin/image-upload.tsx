'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { uploadFile, StoragePlatform, StorageCategory } from '@/lib/storage-utils';

interface ImageUploadProps {
  currentImageUrl?: string;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  platform: StoragePlatform;
  category: StorageCategory;
  label?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto'; // default: video (16:9)
  helperText?: string;
}

export function ImageUpload({ 
  currentImageUrl, 
  onUpload, 
  onRemove, 
  platform, 
  category, 
  label = "이미지 업로드",
  className = "",
  aspectRatio = 'video',
  helperText
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
    auto: 'h-auto min-h-[200px]'
  }[aspectRatio];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
    }
    
    // Validate file size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
    }

    setIsUploading(true);
    try {
      const url = await uploadFile(file, platform, category);
      onUpload(url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>}
      
      <div 
        className={`relative w-full ${aspectClass} rounded-2xl border-2 transition-all duration-200 overflow-hidden group ${
          dragActive 
            ? 'border-orange-500 bg-orange-50' 
            : currentImageUrl 
                ? 'border-gray-200 bg-gray-50' 
                : 'border-dashed border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isUploading ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-20">
             <Loader2 className="w-8 h-8 text-orange-600 animate-spin mb-2" />
             <p className="text-sm font-bold text-gray-500">업로드 중...</p>
           </div>
        ) : null}

        {currentImageUrl ? (
          <>
            <Image 
              src={currentImageUrl} 
              alt="Uploaded" 
              fill 
              className="object-cover" 
              unoptimized // External URLs might need this
            />
            {onRemove && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    onRemove();
                  }}
                  className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>
            )}
            {/* Hover Overlay to Change Image */}
            <div 
                onClick={() => inputRef.current?.click()}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-0"
            >
                <div className="text-white font-bold flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    이미지 변경
                </div>
            </div>
          </>
        ) : (
          <div 
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
          >
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                <ImageIcon className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold">클릭하거나 이미지를 드래그하세요</p>
            <p className="text-xs mt-1 opacity-70">JPG, PNG, GIF (최대 5MB)</p>
          </div>
        )}
        
        <input 
          ref={inputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
        />
      </div>
      {helperText && <p className="text-xs text-gray-500 mt-2 ml-1">{helperText}</p>}
    </div>
  );
}

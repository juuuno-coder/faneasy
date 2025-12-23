'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { storage } from '@/lib/firebaseClient';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  aspectRatio?: 'square' | 'video' | 'wide';
  isDarkMode?: boolean;
}

export default function ImageUpload({ 
  label, 
  value, 
  onChange, 
  disabled,
  aspectRatio = 'square',
  isDarkMode = true
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(p);
        },
        (error) => {
          console.error(error);
          alert('이미지 업로드 중 오류가 발생했습니다.');
          setLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onChange(downloadURL);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'video': return 'aspect-video';
      case 'wide': return 'aspect-[3/1]';
      case 'square': default: return 'aspect-square'; 
    }
  };

  return (
    <div className="space-y-4 w-full">
      <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>{label}</label>
      
      <div 
        onClick={() => !disabled && !loading && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl overflow-hidden group transition-all
          ${isDarkMode ? 'border-white/10 bg-black/20' : 'border-slate-200 bg-slate-50'}
          ${value ? 'border-transparent' : 'hover:border-purple-500/50 hover:bg-opacity-80 cursor-pointer'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${getAspectRatioClass()}
          flex flex-col items-center justify-center
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/*"
          className="hidden"
          disabled={disabled || loading}
        />

        {value ? (
          <>
            <Image 
              src={value} 
              alt="Upload" 
              fill 
              className="object-cover" 
            />
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
                className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 gap-2 p-4 text-center">
            {loading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                <div className="text-xs font-medium text-purple-400">{Math.round(progress)}%</div>
              </>
            ) : (
              <>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-1 group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-white text-slate-400 shadow-sm border border-slate-100'}`}>
                  <Upload className="h-5 w-5" />
                </div>
                <div className={`text-sm font-bold ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>이미지 업로드</div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>클릭하거나 파일을 드래그하세요</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

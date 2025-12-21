"use client";

import { useState, useEffect } from "react";
import { useDataStore } from "@/lib/data-store";
import dynamic from "next/dynamic";

const TiptapEditor = dynamic(() => import("@/components/tiptap-editor"), { ssr: false });

interface DesignEditorProps {
  subdomain: string;
}

export default function DesignEditor({ subdomain }: DesignEditorProps) {
  const { getPageContent, updatePageContent } = useDataStore();
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const content = getPageContent(subdomain);
    if (content) {
      setHeroTitle(content.heroTitle || "");
      setHeroDescription(content.heroDescription || "");
      setBodyContent(content.bodyContent || "");
    }
  }, [subdomain, getPageContent]);

  const handleSave = () => {
    updatePageContent(subdomain, {
      heroTitle,
      heroDescription,
      bodyContent
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold mb-4">메인 페이지 디자인 편집</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              히어로 섹션 제목
            </label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="예: 팬들과 함께 만드는 공간"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              히어로 섹션 설명
            </label>
            <textarea
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              rows={3}
              placeholder="예: 저의 공식 팬페이지에 오신 것을 환영합니다."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상세 내용 (자유 편집)
            </label>
            <TiptapEditor 
              content={bodyContent} 
              onChange={setBodyContent} 
            />
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              저장하기
            </button>
            {isSaved && (
              <span className="text-green-600 font-medium animate-fade-in">
                저장되었습니다!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

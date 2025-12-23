'use client';

import { useState, useEffect } from 'react';
import { Globe, Save, Palette, Code, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuthStore } from '@/lib/store';
import type { SiteSettings } from '@/lib/types';

export default function SettingsTab() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    id: '',
    ownerId: '',
    siteName: '나만의 팬페이지',
    siteDescription: '팬들과 소통하는 가장 쉬운 방법',
    domain: '',
    primaryColor: '#8B5CF6',
    seoTitle: 'FanEasy Page',
    seoDescription: 'Welcome to my FanEasy page',
    updatedAt: new Date().toISOString(),
  });

  // Load settings from Firestore
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      
      try {
        const docId = user.subdomain || user.id; // Use subdomain as ID for influencers, or userID for others
        const docRef = doc(db, 'site_settings', docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSettings(docSnap.data() as SiteSettings);
        } else {
          // Initialize default settings based on user info
          setSettings(prev => ({
            ...prev,
            id: docId,
            ownerId: user.id,
            siteName: user.name + '의 페이지',
            domain: user.subdomain ? `${user.subdomain}.faneasy.kr` : '',
            updatedAt: new Date().toISOString(),
          }));
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const docId = user.subdomain || user.id;
      const docRef = doc(db, 'site_settings', docId);
      
      const newSettings = {
        ...settings,
        id: docId,
        ownerId: user.id,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(docRef, newSettings);
      setSettings(newSettings);
      alert('설정이 성공적으로 저장되었습니다!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('설정 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Site Information */}
      <div className="rounded-3xl border border-white/5 bg-white/2 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Globe className="h-5 w-5 text-purple-500" />
          </div>
          <h3 className="text-xl font-bold">사이트 정보</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">사이트 이름</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="사이트 이름을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">사이트 설명</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="사이트에 대한 설명을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">도메인 (읽기 전용)</label>
            <input
              type="text"
              value={settings.domain}
              readOnly
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-2">* 도메인 변경은 고객센터에 문의해 주세요.</p>
          </div>
        </div>
      </div>

      {/* Design Settings */}
      <div className="rounded-3xl border border-white/5 bg-white/2 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Palette className="h-5 w-5 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold">디자인 설정</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">메인 컬러 (Theme Color)</label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="h-12 w-20 rounded-xl border border-white/10 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="#000000"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">이 색상은 버튼, 링크 및 주요 강조 요소에 적용됩니다.</p>
          </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="rounded-3xl border border-white/5 bg-white/2 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <Code className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-xl font-bold">SEO 설정</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">SEO 제목</label>
            <input
              type="text"
              value={settings.seoTitle}
              onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="검색 결과에 표시될 제목"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">SEO 설명</label>
            <textarea
              value={settings.seoDescription}
              onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="검색 결과에 표시될 설명"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end sticky bottom-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
        >
          {saving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          {saving ? '저장 중...' : '설정 저장하기'}
        </button>
      </div>
    </div>
  );
}

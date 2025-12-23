'use client';

import { useState, useEffect } from 'react';
import { Globe, Save, Palette, Code, Loader2, User as UserIcon, Lock } from 'lucide-react';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuthStore } from '@/lib/store';
import type { SiteSettings } from '@/lib/types';
import ImageUpload from '@/components/ui/image-upload';

export default function SettingsTab() {
  const { user, login } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  // Profile State
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    address: '',
    bio: ''
  });

  // Site Settings State
  const [settings, setSettings] = useState<SiteSettings>({
    id: '',
    ownerId: '',
    siteName: '나만의 팬페이지',
    siteDescription: '팬들과 소통하는 가장 쉬운 방법',
    domain: '',
    primaryColor: '#8B5CF6',
    logoUrl: '',
    bannerUrl: '',
    seoTitle: 'FanEasy Page',
    seoDescription: 'Welcome to my FanEasy page',
    updatedAt: new Date().toISOString(),
  });

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        // 1. Load Profile (from User Store or DB refresh)
        // Ideally we fetch from DB to get 'address', 'phone' etc which might not be in auth token
        const userRef = doc(db, 'users', user.id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const userData = userSnap.data();
            setProfileForm({
                name: userData.name || user.name || '',
                phone: userData.phone || '',
                address: userData.address || '',
                bio: userData.bio || ''
            });
        } else {
            setProfileForm({
                name: user.name || '',
                phone: '',
                address: '',
                bio: ''
            });
        }

        // 2. Load Site Settings
        const docId = user.subdomain || user.id; 
        const settingRef = doc(db, 'site_settings', docId);
        const settingSnap = await getDoc(settingRef);

        if (settingSnap.exists()) {
          setSettings(settingSnap.data() as SiteSettings);
        } else {
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

    loadData();
  }, [user]);

  const handleProfileSave = async () => {
      if (!user) return;
      setProfileSaving(true);
      try {
          const userRef = doc(db, 'users', user.id);
          await updateDoc(userRef, {
              ...profileForm,
              updatedAt: new Date()
          });
          
          // Update local store to reflect name change immediately if needed
          // (Requires a way to update user in store, but simple login(newUser) might work or just let it be)
          
          alert('프로필이 업데이트되었습니다.');
      } catch (e) {
          console.error("Profile update failed", e);
          alert("프로필 저장 실패");
      } finally {
          setProfileSaving(false);
      }
  };

  const handleSiteSave = async () => {
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
      alert('사이트 설정이 저장되었습니다!');
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
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      
      {/* 1. My Profile Section */}
      <div className="rounded-3xl border border-white/5 bg-white/2 p-8">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-pink-500" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">내 정보 수정</h3>
                    <p className="text-sm text-gray-400">회원 정보를 관리합니다.</p>
                </div>
            </div>
            <button
                onClick={handleProfileSave}
                disabled={profileSaving}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-all flex items-center gap-2"
            >
                {profileSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                저장
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">이름 (Name)</label>
                <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="홍길동"
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">연락처 (Phone)</label>
                <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="010-1234-5678"
                />
             </div>
             <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-300 mb-2">주소 (Address)</label>
                <input
                    type="text"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="서울특별시 강남구..."
                />
             </div>
             <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-300 mb-2">소개 (Bio)</label>
                <textarea
                    rows={2}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                    placeholder="자기소개를 입력해주세요."
                />
             </div>
        </div>
      </div>

      <div className="border-t border-white/5 my-8"></div>

      {/* 2. Site Information */}
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
            <div className="flex items-center gap-2">
                <input
                type="text"
                value={settings.domain}
                readOnly
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 focus:outline-none"
                />
                <Lock className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Design Settings */}
      <div className="rounded-3xl border border-white/5 bg-white/2 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Palette className="h-5 w-5 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold">디자인 설정</h3>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Logo Upload */}
             <ImageUpload 
               label="사이트 로고"
               value={settings.logoUrl || ''}
               onChange={(url) => setSettings({ ...settings, logoUrl: url })}
               aspectRatio="square"
             />

             {/* Banner Upload */}
             <ImageUpload 
               label="메인 배너 이미지"
               value={settings.bannerUrl || ''}
               onChange={(url) => setSettings({ ...settings, bannerUrl: url })}
               aspectRatio="video"
             />
          </div>

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
          </div>
        </div>
      </div>

      {/* 4. SEO Settings */}
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

      {/* Site Save Button */}
      <div className="flex justify-end sticky bottom-6">
        <button
          onClick={handleSiteSave}
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

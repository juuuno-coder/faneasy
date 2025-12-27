'use client';

import { useState, useEffect } from 'react';
import { Globe, Save, Palette, Code, Loader2, User as UserIcon, Lock } from 'lucide-react';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuthStore } from '@/lib/store';
import type { SiteSettings } from '@/lib/types';
import ImageUpload from '@/components/ui/image-upload';
import { toast } from 'react-hot-toast';
import { logActivity } from '@/lib/activity-logger';
import { ExternalLink, ShieldCheck, AlertTriangle, Trash2 } from 'lucide-react';
import ConfirmationModal from '@/components/shared/confirmation-modal';

interface SettingsTabProps {
  isDarkMode: boolean;
}

export default function SettingsTab({ isDarkMode }: SettingsTabProps) {
  const { user, login } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [showDeleteSiteModal, setShowDeleteSiteModal] = useState(false);

  const t = {
    card: isDarkMode ? 'bg-white/2 border-white/5' : 'bg-white border-gray-200 shadow-sm',
    label: isDarkMode ? 'text-gray-300' : 'text-slate-700',
    input: isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-slate-900 shadow-sm focus:border-purple-500',
    text: isDarkMode ? 'text-white' : 'text-slate-900',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-slate-500',
    divider: isDarkMode ? 'border-white/5' : 'border-gray-100',
    buttonGhost: isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200',
  };

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
    ogImageUrl: '',
    seoTitle: 'FanEasy Page',
    seoDescription: 'Welcome to my FanEasy page',
    updatedAt: new Date().toISOString(),
  });

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
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
          toast.success('프로필이 업데이트되었습니다.');
      } catch (e) {
          console.error("Profile update failed", e);
          toast.error("프로필 저장 실패");
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
      
      // Log Activity
      if (user) {
        await logActivity({
            type: 'settings',
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            action: '사이트 설정 변경',
            target: `설정 문서 ID: ${docId}`,
            subdomain: user.subdomain || docId
        });
      }

      setSettings(newSettings);
      toast.success('사이트 설정이 저장되었습니다!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('설정 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSite = async () => {
    // Mock deletion logic for safety in this demo
    toast.error('사이트 삭제는 관리자에게 별도 문의가 필요한 기능입니다.');
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
      <div className={`rounded-3xl border p-8 transition-colors ${t.card}`}>
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-pink-500" />
                </div>
                <div>
                    <h3 className={`text-xl font-bold ${t.text}`}>내 정보 수정</h3>
                    <p className={`text-sm ${t.textMuted}`}>회원 정보를 관리합니다.</p>
                </div>
            </div>
            <button
                onClick={handleProfileSave}
                disabled={profileSaving}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${t.buttonGhost}`}
            >
                {profileSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                저장
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className={`block text-sm font-bold mb-2 ${t.label}`}>이름 (Name)</label>
                <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${t.input}`}
                    placeholder="홍길동"
                />
             </div>
             <div>
                <label className={`block text-sm font-bold mb-2 ${t.label}`}>연락처 (Phone)</label>
                <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${t.input}`}
                    placeholder="010-1234-5678"
                />
             </div>
             <div className="md:col-span-2">
                <label className={`block text-sm font-bold mb-2 ${t.label}`}>주소 (Address)</label>
                <input
                    type="text"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${t.input}`}
                    placeholder="서울특별시 강남구..."
                />
             </div>
             <div className="md:col-span-2">
                <label className={`block text-sm font-bold mb-2 ${t.label}`}>소개 (Bio)</label>
                <textarea
                    rows={2}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none ${t.input}`}
                    placeholder="자기소개를 입력해주세요."
                />
             </div>
        </div>
      </div>

      <div className={`border-t my-8 ${t.divider}`}></div>

      {/* 2. Site Information */}
      <div className={`rounded-3xl border p-8 transition-colors ${t.card}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Globe className="h-5 w-5 text-purple-500" />
          </div>
          <h3 className={`text-xl font-bold ${t.text}`}>사이트 정보</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-bold mb-2 ${t.label}`}>사이트 이름</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${t.input}`}
              placeholder="사이트 이름을 입력하세요"
            />
          </div>

          <div>
            <label className={`block text-sm font-bold mb-2 ${t.label}`}>사이트 설명</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              rows={3}
              className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${t.input}`}
              placeholder="사이트에 대한 설명을 입력하세요"
            />
          </div>

          <div>
            <label className={`block text-sm font-bold mb-2 ${t.label}`}>도메인 (읽기 전용)</label>
            <div className="flex items-center gap-2">
                <input
                type="text"
                value={settings.domain}
                readOnly
                className={`flex-1 px-4 py-3 rounded-xl focus:outline-none grayscale opacity-70 ${t.input}`}
                />
                <button 
                  onClick={() => window.open(`https://${settings.domain}`, '_blank')}
                  className={`p-3 rounded-xl border transition-all ${isDarkMode ? 'hover:bg-white/10 border-white/10' : 'hover:bg-gray-100 border-gray-200'}`}
                  title="사이트 방문"
                >
                  <ExternalLink className="w-4 h-4 text-purple-500" />
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Design Settings */}
      <div className={`rounded-3xl border p-8 transition-colors ${t.card}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Palette className="h-5 w-5 text-blue-500" />
          </div>
          <h3 className={`text-xl font-bold ${t.text}`}>디자인 설정</h3>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <ImageUpload 
               label="사이트 로고"
               value={settings.logoUrl || ''}
               onChange={(url) => setSettings({ ...settings, logoUrl: url })}
               aspectRatio="square"
               isDarkMode={isDarkMode}
             />

             <ImageUpload 
               label="메인 배너 이미지"
               value={settings.bannerUrl || ''}
               onChange={(url) => setSettings({ ...settings, bannerUrl: url })}
               aspectRatio="video"
               isDarkMode={isDarkMode}
             />
          </div>

          <div>
            <label className={`block text-sm font-bold mb-2 ${t.label}`}>메인 컬러 (Theme Color)</label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className={`h-12 w-20 rounded-xl border cursor-pointer bg-transparent ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className={`flex-1 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${t.input}`}
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. SEO Settings */}
      <div className={`rounded-3xl border p-8 transition-colors ${t.card}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <Code className="h-5 w-5 text-green-500" />
          </div>
          <h3 className={`text-xl font-bold ${t.text}`}>SEO 설정</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-bold mb-2 ${t.label}`}>SEO 제목</label>
            <input
              type="text"
              value={settings.seoTitle}
              onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${t.input}`}
              placeholder="검색 결과에 표시될 제목"
            />
          </div>

          <div>
            <label className={`block text-sm font-bold mb-2 ${t.label}`}>SEO 설명 (Meta Description)</label>
            <textarea
              value={settings.seoDescription}
              onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
              rows={3}
              className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${t.input}`}
              placeholder="검색 결과 및 SNS 공유 시 표시될 설명"
            />
          </div>

          <div className="pt-4 border-t border-dashed border-white/10">
             <ImageUpload 
               label="오픈그래프(OG) 이미지"
               value={settings.ogImageUrl || ''}
               onChange={(url) => setSettings({ ...settings, ogImageUrl: url })}
               aspectRatio="video"
               isDarkMode={isDarkMode}
             />
             <p className={`text-[11px] mt-2 ${t.textMuted}`}>
                * 카카오톡, 페이스북 등 SNS에 사이트 링크를 공유할 때 표시되는 이미지입니다. (추천: 1200x630)
             </p>
          </div>
        </div>
      </div>

      {/* 5. Domain Management */}
      <div className={`rounded-3xl border p-8 transition-colors ${t.card}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Globe className="h-5 w-5 text-orange-500" />
          </div>
          <h3 className={`text-xl font-bold ${t.text}`}>도메인 및 보안 관리</h3>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold uppercase ${t.textMuted}`}>기본 서브도메인</span>
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full border border-green-500/20">ACTIVE</span>
                </div>
                <div className={`text-lg font-mono font-bold ${t.text}`}>
                    {settings.domain || 'loading...'}
                </div>
             </div>

             <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold uppercase ${t.textMuted}`}>SSL 보안 연결</span>
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                </div>
                <div className={`text-lg font-bold ${t.text}`}>가동 중 (Auto-Renew)</div>
             </div>
          </div>

          <div className={`p-6 rounded-2xl border border-dashed ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
             <h4 className={`font-bold mb-2 flex items-center gap-2 ${t.text}`}>
                커스텀 도메인 연결 (PRO)
             </h4>
             <p className={`text-sm mb-4 ${t.textMuted}`}>
                개인 도메인(예: www.influencer.com)을 팬페이지에 연결할 수 있습니다.
             </p>
             <button className={`w-full py-3 rounded-xl text-sm font-bold border transition-all ${isDarkMode ? 'hover:bg-white/10 border-white/10' : 'hover:bg-gray-100 border-gray-200'}`}>
                관리자에게 커스텀 도메인 요청하기
             </button>
          </div>
        </div>
      </div>

      {/* 6. Danger Zone */}
      <div className={`rounded-3xl border p-8 transition-colors border-red-500/20 ${isDarkMode ? 'bg-red-500/5' : 'bg-red-50'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <h3 className={`text-xl font-bold text-red-500`}>위험 지역 (Danger Zone)</h3>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
                <h4 className={`font-bold ${t.text}`}>사이트 삭제</h4>
                <p className={`text-sm ${t.textMuted}`}>이 사이트의 모든 설정, 페이지 디자인, 고객 데이터가 영구적으로 삭제됩니다.</p>
            </div>
            <button 
                onClick={() => setShowDeleteSiteModal(true)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2"
            >
                <Trash2 size={16} />
                사이트 영구 삭제
            </button>
        </div>
      </div>

      <div className="flex justify-end sticky bottom-6 z-10">
        <button
          onClick={handleSiteSave}
          disabled={saving}
          className={`flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-900/10 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
        >
          {saving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          {saving ? '저장 중...' : '설정이 변경되었습니다 - 저장하기'}
        </button>
      </div>

      <ConfirmationModal 
          isOpen={showDeleteSiteModal}
          onClose={() => setShowDeleteSiteModal(false)}
          onConfirm={handleDeleteSite}
          title="사이트 영구 삭제"
          message={`정말 [${settings.siteName}] 사이트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며 모든 데이터가 즉시 소멸됩니다.`}
          confirmLabel="내용을 확인했으며 전체 삭제합니다"
          variant="danger"
          isDarkMode={isDarkMode}
      />
    </div>
  );
}

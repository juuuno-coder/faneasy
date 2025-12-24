'use client';

import { useState } from 'react';
import { X, User, Mail, Save, Lock, Shield, Loader2, CheckCircle2 } from 'lucide-react';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
  } | null;
  onSave: (data: { name: string; email: string }) => Promise<void>;
}

export default function ProfileModal({ isOpen, onClose, user, onSave }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [saving, setSaving] = useState(false);
  
  // Password Change State
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passLoading, setPassLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!formData.name.trim()) {
        toast.error('이름을 입력해주세요.');
        return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      toast.success('프로필이 성공적으로 저장되었습니다.');
      onClose();
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      if (error.code === 'permission-denied') {
          toast.error('변경 권한이 없습니다. 다시 로그인 해주세요.');
      } else {
          toast.error('프로필 저장 중 오류가 발생했습니다.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
        toast.error('모든 비밀번호 항목을 입력해주세요.');
        return;
    }
    if (passwords.new !== passwords.confirm) {
        toast.error('새 비밀번호가 일치하지 않습니다.');
        return;
    }
    if (passwords.new.length < 6) {
        toast.error('비밀번호는 6자 이상이어야 합니다.');
        return;
    }

    setPassLoading(true);
    try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        
        if (!currentUser || !currentUser.email) {
            toast.error('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
            return;
        }

        // 1. Re-authenticate
        const credential = EmailAuthProvider.credential(currentUser.email, passwords.current);
        await reauthenticateWithCredential(currentUser, credential);

        // 2. Update Password
        await updatePassword(currentUser, passwords.new);
        
        toast.success('비밀번호가 변경되었습니다. 다음 로그인부터 사용하세요.');
        setPasswords({ current: '', new: '', confirm: '' });
        
    } catch (error: any) {
        console.error('Password change error:', error);
        if (error.code === 'auth/wrong-password') {
            toast.error('현재 비밀번호가 올바르지 않습니다.');
        } else if (error.code === 'auth/requires-recent-login') {
            toast.error('보안을 위해 다시 로그인 후 시도해주세요.');
        } else {
            toast.error('비밀번호 변경 실패: ' + error.message);
        }
    } finally {
        setPassLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#121212] shadow-2xl"
        >
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-2">
                <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Shield className="h-6 w-6 text-purple-500" />
                        계정 관리
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">개인정보 및 보안 설정을 관리하세요.</p>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 -mr-2 -mt-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Tabs */}
            <div className="px-6 mt-6 flex gap-6 border-b border-white/5">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`pb-3 text-sm font-bold transition-all relative ${
                        activeTab === 'profile' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                    }`}
                >
                    프로필 정보
                    {activeTab === 'profile' && (
                        <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-500" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`pb-3 text-sm font-bold transition-all relative ${
                        activeTab === 'security' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                    }`}
                >
                    보안 및 비밀번호
                    {activeTab === 'security' && (
                        <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-500" />
                    )}
                </button>
            </div>

            {/* Content Body */}
            <div className="p-6">
                <AnimatePresence mode="wait">
                    {activeTab === 'profile' ? (
                        <motion.div 
                            key="profile"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">이름 (표시 이름)</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder-gray-600 font-medium"
                                            placeholder="홍길동"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2 ml-1">
                                        * 사이트 내 활동 시 다른 사용자에게 보여지는 이름입니다.
                                    </p>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">이메일 주소</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            readOnly
                                            className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/5 rounded-xl text-gray-400 focus:outline-none cursor-not-allowed font-mono text-sm"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <Lock className="h-3 w-3 text-gray-600" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2 ml-1">
                                        * 로그인 아이디로 사용되는 이메일은 변경할 수 없습니다.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-900/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        저장 중...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-5 w-5" />
                                        변경사항 저장
                                    </>
                                )}
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="security"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-5"
                        >
                            <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 mb-4">
                                <p className="text-xs text-yellow-500/80 font-medium leading-relaxed">
                                    안전한 계정 보호를 위해 비밀번호는 주기적으로 변경하는 것이 좋습니다.
                                    타 사이트와 다른 비밀번호를 사용해주세요.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">현재 비밀번호</label>
                                    <input 
                                        type="password"
                                        value={passwords.current}
                                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 transition-all placeholder-gray-600"
                                        placeholder="현재 사용중인 비밀번호"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">새 비밀번호</label>
                                        <input 
                                            type="password"
                                            value={passwords.new}
                                            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 transition-all placeholder-gray-600"
                                            placeholder="6자 이상 입력"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">비밀번호 확인</label>
                                        <input 
                                            type="password"
                                            value={passwords.confirm}
                                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 transition-all placeholder-gray-600 ${
                                                passwords.new && passwords.confirm && passwords.new !== passwords.confirm 
                                                ? 'border-red-500/50 focus:border-red-500' 
                                                : 'border-white/10'
                                            }`}
                                            placeholder="한 번 더 입력"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleChangePassword}
                                disabled={passLoading || !passwords.current || !passwords.new || !passwords.confirm || passwords.new !== passwords.confirm}
                                className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                            >
                                {passLoading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        처리 중...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="h-4 w-4" />
                                        비밀번호 변경하기
                                    </>
                                )}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { X, User, Mail, Save, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
  } | null;
  onSave: (data: { name: string; email: string }) => void;
}

export default function ProfileModal({ isOpen, onClose, user, onSave }: ProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [saving, setSaving] = useState(false);
  
  // Password Change State
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passLoading, setPassLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('프로필 저장 실패');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
        alert('모든 항목을 입력해주세요.');
        return;
    }
    if (passwords.new !== passwords.confirm) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return;
    }
    if (passwords.new.length < 6) {
        alert('비밀번호는 6자 이상이어야 합니다.');
        return;
    }

    setPassLoading(true);
    try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        
        if (!currentUser || !currentUser.email) {
            alert('로그인 정보를 찾을 수 없습니다.');
            return;
        }

        // 1. Re-authenticate
        const credential = EmailAuthProvider.credential(currentUser.email, passwords.current);
        await reauthenticateWithCredential(currentUser, credential);

        // 2. Update Password
        await updatePassword(currentUser, passwords.new);
        
        alert('비밀번호가 성공적으로 변경되었습니다. 다음 로그인부터 새 비밀번호를 사용해주세요.');
        setPasswords({ current: '', new: '', confirm: '' });
        setShowPasswordChange(false);

    } catch (error: any) {
        console.error('Password change error:', error);
        if (error.code === 'auth/wrong-password') {
            alert('현재 비밀번호가 올바르지 않습니다.');
        } else {
            alert('비밀번호 변경 실패: ' + error.message);
        }
    } finally {
        setPassLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1A1A1B] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#1A1A1B] z-10">
          <h3 className="text-xl font-bold text-white">프로필 관리</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Default Profile Form */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-2">기본 정보</h4>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                이름
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-600"
                placeholder="이름을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                이메일
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-600"
                placeholder="이메일을 입력하세요"
                readOnly // Usually email change requires more validation
              />
              <p className="text-xs text-gray-500 mt-1 ml-1">* 이메일 변경은 관리자에게 문의하세요.</p>
            </div>
          </div>

          <div className="h-[1px] bg-white/10 my-4" />

          {/* Password Change Section */}
          <div className="space-y-4">
             <button 
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="flex items-center justify-between w-full text-left group"
             >
                <h4 className="text-sm font-bold text-gray-400 group-hover:text-purple-400 uppercase tracking-wider transition-colors flex items-center gap-2">
                   <Lock className="h-4 w-4" />
                   비밀번호 변경
                </h4>
                {showPasswordChange ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
             </button>

             {showPasswordChange && (
                <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">현재 비밀번호</label>
                        <input 
                            type="password"
                            value={passwords.current}
                            onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                            className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                            placeholder="현재 비밀번호 입력"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">새 비밀번호</label>
                        <input 
                            type="password"
                            value={passwords.new}
                            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                            className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                            placeholder="6자 이상 입력"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">새 비밀번호 확인</label>
                        <input 
                            type="password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                            className={`w-full px-3 py-2 bg-black/30 border rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 ${passwords.new && passwords.confirm && passwords.new !== passwords.confirm ? 'border-red-500' : 'border-white/10'}`}
                            placeholder="새 비밀번호 다시 입력"
                        />
                        {passwords.new && passwords.confirm && passwords.new !== passwords.confirm && (
                            <p className="text-xs text-red-400 mt-1">비밀번호가 일치하지 않습니다.</p>
                        )}
                    </div>
                    
                    <button
                        onClick={handleChangePassword}
                        disabled={passLoading || !passwords.current || !passwords.new || !passwords.confirm || passwords.new !== passwords.confirm}
                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-all"
                    >
                        {passLoading ? '변경 중...' : '비밀번호 변경하기'}
                    </button>
                </div>
             )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white/5 flex gap-3 border-t border-white/10">
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors"
            disabled={saving}
          >
            닫기
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20"
            disabled={saving}
          >
            <Save className="h-4 w-4" />
            {saving ? '저장 중...' : '변경사항 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}

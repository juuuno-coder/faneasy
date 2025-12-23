'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { UserRole } from '@/lib/types';
import { Search, Loader2, Edit2, Check, X, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subdomain?: string;
  createdAt: any;
  joinedSite?: string;
}

interface UsersTabProps {
  isDarkMode: boolean;
}

export default function UsersTab({ isDarkMode }: UsersTabProps) {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ role: UserRole; subdomain: string }>({ role: 'user', subdomain: '' });
  const [saving, setSaving] = useState(false);

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isOwner = currentUser?.role === 'owner';
  const isDark = isDarkMode; 

  const theme = {
    card: isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm',
    headerBg: isDark ? 'bg-black/20 text-gray-400' : 'bg-slate-50 text-slate-600 border-b border-gray-100',
    rowHover: isDark ? 'hover:bg-white/5' : 'hover:bg-purple-50/50',
    text: isDark ? 'text-white' : 'text-slate-900',
    textSub: isDark ? 'text-gray-500' : 'text-slate-500',
    inputBg: isDark ? 'bg-[#1A1A1C] border-white/10 text-white' : 'bg-white border-gray-200 text-slate-700',
    selectBg: isDark ? 'bg-[#0A0A0B] border-white/20 text-white' : 'bg-white border-gray-200 text-slate-700',
    divider: isDark ? 'divide-white/5' : 'divide-gray-100',
    badge: {
       super_admin: isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-100',
       owner: isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-600 border-purple-100',
       admin: isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100',
       user: isDark ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' : 'bg-gray-50 text-gray-500 border-gray-100',
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    let q;
    if (isSuperAdmin) {
       // Super Admin sees ALL users
       q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    } else if (isOwner && currentUser.subdomain) {
       // Owner sees ONLY users who joined their site
       q = query(collection(db, 'users'), where('joinedSite', '==', currentUser.subdomain));
    } else {
       setUsers([]);
       setLoading(false);
       return;
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserData[];
      
      // Client-side sort if needed (since where queries might mess up order without composite index)
      fetchedUsers.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
      });

      setUsers(fetchedUsers);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, isSuperAdmin, isOwner]);

  const canEdit = (targetUser: UserData) => {
    if (isSuperAdmin) return true;
    if (isOwner) {
       // Can only edit users or admins (not owners or super_admins)
       // Can promote user -> admin
       return targetUser.role === 'user' || targetUser.role === 'admin';
    }
    return false;
  };

  const handleEdit = (user: UserData) => {
    setEditingId(user.id);
    setEditForm({
      role: user.role,
      subdomain: user.subdomain || ''
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ role: 'user', subdomain: '' });
  };

  const handleSave = async (userId: string) => {
    setSaving(true);
    try {
      const userRef = doc(db, 'users', userId);
      const updates: any = {
        role: editForm.role,
        updatedAt: new Date()
      };
      
      // Only update subdomain if Super Admin
      if (isSuperAdmin) {
          updates.subdomain = editForm.subdomain || null;
      }

      await updateDoc(userRef, updates);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("업데이트 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.subdomain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className={`text-xl font-bold ${theme.text}`}>
            {isSuperAdmin ? '전체 사용자 관리' : '회원 관리'}
          </h2>
          <p className={`text-sm mt-1 ${theme.textSub}`}>
            {isSuperAdmin 
              ? '등록된 모든 사용자의 권한과 사이트 설정을 관리합니다.' 
              : '내 사이트에 가입한 회원들을 관리하고 부관리자로 승격할 수 있습니다.'}
          </p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text"
            placeholder="이름, 이메일 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors ${theme.inputBg}`}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className={`overflow-hidden rounded-2xl border ${theme.card}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={theme.headerBg}>
              <tr>
                <th className="px-6 py-4 font-medium">사용자 정보</th>
                <th className="px-6 py-4 font-medium">역할 (Role)</th>
                {isSuperAdmin && <th className="px-6 py-4 font-medium">사이트 (Subdomain)</th>}
                <th className="px-6 py-4 font-medium">가입일</th>
                <th className="px-6 py-4 font-medium text-right">관리</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme.divider}`}>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 5 : 4} className="px-6 py-12 text-center text-gray-500">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className={`${theme.rowHover} transition-colors`}>
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold uppercase shadow-sm ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                          {user.name?.[0] || 'U'}
                        </div>
                        <div>
                          <div className={`font-bold ${theme.text}`}>{user.name}</div>
                          <div className={`text-xs ${theme.textSub}`}>{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role Edit */}
                    <td className="px-6 py-4">
                      {editingId === user.id ? (
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserRole })}
                          className={`rounded px-2 py-1 text-xs focus:border-purple-500 outline-none shadow-sm ${theme.selectBg}`}
                        >
                          <option value="user">User (팬)</option>
                          <option value="admin">Admin (부관리자)</option>
                          {isSuperAdmin && (
                            <>
                              <option value="owner">Owner (사이트 주인)</option>
                              <option value="super_admin">Super Admin</option>
                            </>
                          )}
                        </select>
                      ) : (
                        <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium border shadow-sm ${theme.badge[user.role] || theme.badge['user']}`}>
                          {user.role === 'super_admin' ? '최고관리자' :
                           user.role === 'owner' ? '사이트 소유자' :
                           user.role === 'admin' ? '부관리자' : '일반 회원'}
                        </span>
                      )}
                    </td>

                    {/* Subdomain Edit (Super Admin Only) */}
                    {isSuperAdmin && (
                      <td className="px-6 py-4">
                        {editingId === user.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={editForm.subdomain}
                              onChange={(e) => setEditForm({ ...editForm, subdomain: e.target.value })}
                              placeholder="subdomain"
                              className={`rounded px-2 py-1 text-xs w-24 focus:border-purple-500 outline-none ${theme.inputBg}`}
                            />
                            <span className={`text-xs ${theme.textSub}`}>.faneasy.kr</span>
                          </div>
                        ) : (
                          user.subdomain ? (
                            <div className="flex items-center gap-2">
                              <span className={`font-mono text-xs font-medium px-1.5 py-0.5 rounded border ${isDark ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>{user.subdomain}</span>
                              <a 
                                href={`/sites/${user.subdomain}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className={`text-[10px] px-1.5 py-0.5 rounded transition-colors shadow-sm ${isDark ? 'bg-white/10 hover:bg-white/20 text-gray-300' : 'bg-white hover:bg-gray-50 text-gray-500 border border-gray-200'}`}
                              >
                                이동
                              </a>
                            </div>
                          ) : (
                            <span className="text-gray-300 text-xs">-</span>
                          )
                        )}
                      </td>
                    )}

                    {/* Created At */}
                    <td className={`px-6 py-4 text-xs tabular-nums ${theme.textSub}`}>
                      {user.createdAt?.seconds 
                        ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() 
                        : (user.createdAt instanceof Date ? user.createdAt.toLocaleDateString() : 'Unknown')}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {editingId === user.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSave(user.id)}
                            disabled={saving}
                            className={`p-1.5 rounded transition-colors border ${isDark ? 'bg-green-500/20 text-green-400 border-green-500/20 hover:bg-green-500/30' : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'}`}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={saving}
                            className={`p-1.5 rounded transition-colors border ${isDark ? 'bg-red-500/20 text-red-400 border-red-500/20 hover:bg-red-500/30' : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        canEdit(user) && (
                          <button
                            onClick={() => handleEdit(user)}
                            className={`px-3 py-1.5 rounded-lg border shadow-sm text-xs font-medium transition-all flex items-center gap-1 ml-auto ${isDark ? 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10' : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'}`}
                          >
                            <Edit2 className="w-3 h-3" />
                            관리
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Helper Info */}
      {isSuperAdmin && (
        <div className={`border rounded-xl p-4 flex items-start gap-3 ${isDark ? 'bg-yellow-500/5 border-yellow-500/10' : 'bg-amber-50 border-amber-100'}`}>
          <ShieldAlert className={`w-5 h-5 shrink-0 mt-0.5 ${isDark ? 'text-yellow-500' : 'text-amber-500'}`} />
          <div className="text-sm">
            <h4 className={`font-bold mb-1 ${isDark ? 'text-yellow-500' : 'text-amber-700'}`}>사용자 권한 관리 주의사항</h4>
            <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-amber-600'}`}>
              사용자의 역할을 <strong>Owner</strong>로 변경하고 <strong>Subdomain</strong>을 입력하면, 해당 사용자는 관리자 대시보드에서 자신의 사이트를 관리할 수 있게 됩니다.<br/>
              예: 역할을 'Owner'로, 사이트를 'bizon'으로 설정하면 해당 사용자는 <strong>bizon.faneasy.kr</strong>의 소유자가 됩니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

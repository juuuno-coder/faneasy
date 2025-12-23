import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { UserRole } from '@/lib/types';
import { Search, Loader2, Edit2, Check, X, ShieldAlert } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subdomain?: string;
  createdAt: any;
  joinedSite?: string;
}

export default function UsersTab() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 편집 모드 상태
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ role: UserRole; subdomain: string }>({ role: 'user', subdomain: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // 모든 유저 불러오기
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserData[];
      
      setUsers(fetchedUsers);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
      await updateDoc(userRef, {
        role: editForm.role,
        subdomain: editForm.subdomain || null, // 빈 문자열이면 null 처리
        updatedAt: new Date()
      });
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
          <h2 className="text-xl font-bold">전체 사용자 관리</h2>
          <p className="text-sm text-gray-400 mt-1">
            등록된 모든 사용자의 권한과 사이트 설정을 관리합니다.
          </p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text"
            placeholder="이름, 이메일, 사이트 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1A1A1C] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-purple-50/50 text-gray-600 border-b border-purple-100">
              <tr>
                <th className="px-6 py-4 font-medium">사용자 정보</th>
                <th className="px-6 py-4 font-medium">역할 (Role)</th>
                <th className="px-6 py-4 font-medium">사이트 (Subdomain)</th>
                <th className="px-6 py-4 font-medium">가입일</th>
                <th className="px-6 py-4 font-medium text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-purple-50/30 transition-colors">
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold uppercase shadow-sm">
                          {user.name?.[0] || 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role Edit */}
                    <td className="px-6 py-4">
                      {editingId === user.id ? (
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserRole })}
                          className="bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:border-purple-500 outline-none text-gray-700 shadow-sm"
                        >
                          <option value="user">User (팬)</option>
                          <option value="owner">Owner (사이트 주인)</option>
                          <option value="admin">Admin (관리자)</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium border shadow-sm ${
                          user.role === 'super_admin' ? 'bg-red-50 text-red-600 border-red-100' :
                          user.role === 'owner' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                          user.role === 'admin' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-gray-50 text-gray-500 border-gray-100'
                        }`}>
                          {user.role === 'super_admin' ? '최고관리자' :
                           user.role === 'owner' ? '사이트 소유자' :
                           user.role === 'admin' ? '관리자' : '일반 회원'}
                        </span>
                      )}
                    </td>

                    {/* Subdomain Edit */}
                    <td className="px-6 py-4">
                      {editingId === user.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editForm.subdomain}
                            onChange={(e) => setEditForm({ ...editForm, subdomain: e.target.value })}
                            placeholder="subdomain"
                            className="bg-white border border-gray-200 rounded px-2 py-1 text-xs w-24 focus:border-purple-500 outline-none text-gray-700"
                          />
                          <span className="text-xs text-gray-400">.faneasy.kr</span>
                        </div>
                      ) : (
                        user.subdomain ? (
                          <div className="flex items-center gap-2">
                            <span className="text-purple-600 font-mono text-xs font-medium bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">{user.subdomain}</span>
                            <a 
                              href={`/sites/${user.subdomain}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded hover:bg-gray-50 text-gray-500 transition-colors shadow-sm"
                            >
                              이동
                            </a>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-xs">-</span>
                        )
                      )}
                    </td>

                    {/* Created At */}
                    <td className="px-6 py-4 text-gray-500 text-xs tabular-nums">
                      {user.createdAt?.seconds 
                        ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() 
                        : 'Unknown'}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {editingId === user.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSave(user.id)}
                            disabled={saving}
                            className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors border border-green-100"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={saving}
                            className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors border border-red-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-white hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm text-xs font-medium transition-all flex items-center gap-1 ml-auto"
                        >
                          <Edit2 className="w-3 h-3" />
                          관리
                        </button>
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
      <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
        <div className="text-sm">
          <h4 className="font-bold text-yellow-500 mb-1">사용자 권한 관리 주의사항</h4>
          <p className="text-gray-400 leading-relaxed">
            사용자의 역할을 <strong>Owner</strong>로 변경하고 <strong>Subdomain</strong>을 입력하면, 해당 사용자는 관리자 대시보드에서 자신의 사이트를 관리할 수 있게 됩니다.<br/>
            예: 역할을 'Owner'로, 사이트를 'bizon'으로 설정하면 해당 사용자는 <strong>bizon.faneasy.kr</strong>의 소유자가 됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}

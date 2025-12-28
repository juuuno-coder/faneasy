import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  where, 
  getDocs, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { UserRole, SiteNode } from '@/lib/types';
import Link from 'next/link';
import { 
  ChevronRight, 
  ChevronDown, 
  Globe, 
  User, 
  MoreHorizontal, 
  FolderPlus,
  GripVertical,
  Check,
  X,
  ShieldCheck,
  UserCheck,
  Loader2
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subdomain?: string;
  joinedSite?: string; // Parent site subdomain
  photoURL?: string;
}

interface TreeNode {
  id: string;
  type: 'site' | 'user';
  data: SiteNode | UserData;
  children: TreeNode[];
}

interface SiteTreeViewProps {
  userRole?: UserRole;
  currentSubdomain?: string;
  isDarkMode?: boolean;
}

export default function SiteTreeView({ userRole, currentSubdomain, isDarkMode = false }: SiteTreeViewProps) {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['kkang']));
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  
  // Assignment Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'owner' | 'admin'>('owner');
  const [targetSite, setTargetSite] = useState<SiteNode | null>(null);
  const [saving, setSaving] = useState(false);

  const isSuperAdmin = userRole === 'super_admin';
  const isDark = isDarkMode;

  const theme = {
    card: isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200 shadow-sm',
    text: isDark ? 'text-gray-200' : 'text-slate-900',
    textMuted: isDark ? 'text-gray-500' : 'text-slate-500',
    textDim: isDark ? 'text-gray-400' : 'text-slate-600',
    bgHover: isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50',
    border: isDark ? 'border-white/5' : 'border-slate-100',
    iconColor: isDark ? 'text-gray-400' : 'text-slate-400',
    folderIcon: isDark ? 'text-purple-400' : 'text-purple-600',
    modalBg: isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-slate-200 shadow-2xl',
    buttonGhost: isDark ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-slate-100 text-slate-600',
    buttonPrimary: 'bg-purple-600 hover:bg-purple-700 text-white',
  };

  // 1. Initial Data Loading & Seeding
  useEffect(() => {
    if (!currentSubdomain) return;

    // Fetch Sites (Sub-sites of currentSubdomain)
    const qSites = query(collection(db, 'sites'), where('parentSiteId', '==', currentSubdomain));
    const unsubscribeSites = onSnapshot(qSites, async (snapshot) => {
      let fetchedSites = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SiteNode[];

      // Seeding for 'kkang' example
      if (currentSubdomain === 'kkang' && fetchedSites.length === 0) {
        const demoSites = [
          { id: 'fan1', name: 'Fan 1', parentSiteId: 'kkang' },
          { id: 'fan2', name: 'Fan 2', parentSiteId: 'kkang' },
          { id: 'fan3', name: 'Fan 3', parentSiteId: 'kkang' },
          { id: 'bizon', name: 'Bizon', parentSiteId: 'kkang' },
        ];
        for (const s of demoSites) {
          await setDoc(doc(db, 'sites', s.id), {
            ...s,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
        return; // onSnapshot will trigger again
      }

      // Fetch All Users associated with this parent or its sub-sites
      const qUsers = query(collection(db, 'users'));
      const unsubscribeUsers = onSnapshot(qUsers, (userSnap) => {
        const users = userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserData[];
        setAllUsers(users);
        buildTree(fetchedSites, users);
      });

      return () => unsubscribeUsers();
    });

    return () => unsubscribeSites();
  }, [currentSubdomain]);

  const buildTree = (sites: SiteNode[], users: UserData[]) => {
    const tree: TreeNode[] = [];
    
    // 1. Root Node (Current Site)
    const rootNode: TreeNode = {
        id: currentSubdomain!,
        type: 'site',
        data: { id: currentSubdomain!, name: currentSubdomain!, parentSiteId: '', createdAt: '', updatedAt: '' } as SiteNode,
        children: []
    };

    // 2. Add Sub-sites
    sites.forEach(site => {
        const siteNode: TreeNode = {
            id: site.id,
            type: 'site',
            data: site,
            children: []
        };
        
        // 3. Add users belonging to this sub-site
        const siteUsers = users.filter(u => u.subdomain === site.id || u.joinedSite === site.id);
        siteNode.children = siteUsers.map(u => ({
            id: u.id,
            type: 'user',
            data: u,
            children: []
        }));

        rootNode.children.push(siteNode);
    });

    // 4. Add users belonging directly to parent (but not in sub-sites)
    const directUsers = users.filter(u => 
        (u.subdomain === currentSubdomain || u.joinedSite === currentSubdomain) && 
        !sites.some(s => s.id === u.subdomain || s.id === u.joinedSite)
    );
    
    directUsers.forEach(u => {
        rootNode.children.push({
            id: u.id,
            type: 'user',
            data: u,
            children: []
        });
    });

    setNodes([rootNode]);
  };

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAssign = (type: 'owner' | 'admin', site: SiteNode) => {
    setModalType(type);
    setTargetSite(site);
    setShowModal(true);
  };

  const executeAssignment = async (user: UserData) => {
    if (!targetSite) return;
    setSaving(true);
    try {
        const siteRef = doc(db, 'sites', targetSite.id);
        const updateData: any = { updatedAt: new Date().toISOString() };
        
        if (modalType === 'owner') {
            updateData.ownerId = user.id;
            updateData.ownerName = user.name;
            // Also optionally update user role if needed
            await updateDoc(doc(db, 'users', user.id), {
                role: 'owner',
                subdomain: targetSite.id
            });
        } else {
            const currentAdmins = targetSite.adminIds || [];
            if (!currentAdmins.includes(user.id)) {
                updateData.adminIds = [...currentAdmins, user.id];
                await updateDoc(doc(db, 'users', user.id), {
                    role: 'admin',
                    subdomain: targetSite.id
                });
            }
        }

        await updateDoc(siteRef, updateData);
        setShowModal(false);
    } catch (error) {
        console.error("Assignment failed:", error);
        alert("지정 실패: " + error);
    } finally {
        setSaving(false);
    }
  };

  const TreeItem = ({ node, level }: { node: TreeNode; level: number }) => {
    const isExpanded = expanded.has(node.id);
    const hasChildren = node.children.length > 0;
    const isSite = node.type === 'site';
    const siteData = isSite ? (node.data as SiteNode) : null;
    const userData = !isSite ? (node.data as UserData) : null;

    return (
      <div className="select-none">
        <div 
          className={`
            group flex items-center gap-3 p-2.5 rounded-xl transition-all mb-0.5
            ${theme.bgHover}
          `}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
        >
          {/* Toggle */}
          <button 
            onClick={() => toggleExpand(node.id)}
            className={`p-1 rounded-lg hover:bg-black/5 ${theme.iconColor} ${!hasChildren && 'opacity-0'}`}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {/* Icon */}
          <div className={isSite ? theme.folderIcon : theme.iconColor}>
             {isSite ? <Globe size={18} /> : <User size={18} />}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`font-bold text-sm ${theme.text}`}>
                {isSite ? siteData?.name : userData?.name}
              </span>
              {isSite && siteData?.id !== currentSubdomain && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${theme.border} ${theme.textMuted}`}>
                  {siteData?.id}.faneasy.kr
                </span>
              )}
              {!isSite && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border border-purple-500/20 text-purple-500 bg-purple-500/5`}>
                  {userData?.role.toUpperCase()}
                </span>
              )}
            </div>
            {isSite && siteData?.ownerName && (
              <div className="flex items-center gap-1.5 mt-0.5">
                 <UserCheck size={10} className="text-green-500" />
                 <span className="text-[10px] text-green-500 font-medium">소유자: {siteData.ownerName}</span>
              </div>
            )}
            {!isSite && (
                <div className={`text-[11px] ${theme.textDim}`}>{userData?.email}</div>
            )}
          </div>

          {/* Site Actions */}
          {isSite && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link 
                href={siteData?.id === 'kkang' ? '/admin' : `/sites/${siteData?.id}/admin`}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black bg-purple-600 text-white hover:bg-purple-700 transition-all`}
              >
                관리 바로가기 <ChevronRight size={10} />
              </Link>
              
              {isSuperAdmin && siteData?.id !== currentSubdomain && (
                <>
                  <button 
                    onClick={() => handleAssign('owner', siteData!)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black border border-green-500/30 text-green-500 hover:bg-green-500 hover:text-white transition-all`}
                  >
                    [소유자 지정]
                  </button>
                  <button 
                    onClick={() => handleAssign('admin', siteData!)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black border border-blue-500/30 text-blue-500 hover:bg-blue-500 hover:text-white transition-all`}
                  >
                    [관리자 지정]
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {isExpanded && hasChildren && (
          <div className={`ml-4 border-l ${theme.border}`}>
            {node.children.map(child => (
              <TreeItem key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`rounded-3xl border p-8 ${theme.card}`}>
      <div className="mb-8">
        <h3 className={`text-2xl font-black ${theme.text}`}>사이트 구조도</h3>
      </div>

      <div className="space-y-1">
        {nodes.map(node => (
          <TreeItem key={node.id} node={node} level={0} />
        ))}
      </div>

      {/* Member Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-md rounded-3xl border p-8 ${theme.modalBg} animate-in zoom-in-95 duration-200`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className={`text-xl font-black ${theme.text}`}>
                  {modalType === 'owner' ? '소유자 지정' : '관리자 지정'}
                </h4>
                <p className={`text-sm ${theme.textMuted}`}>{targetSite?.name} 사이트 리더를 선택하세요.</p>
              </div>
              <button onClick={() => setShowModal(false)} className={`p-2 rounded-xl ${theme.buttonGhost}`}>
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {allUsers
                .filter(u => u.joinedSite === currentSubdomain || u.subdomain === currentSubdomain)
                .map(member => (
                <button
                  key={member.id}
                  onClick={() => executeAssignment(member)}
                  disabled={saving}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${theme.bgHover} ${theme.border}`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 font-bold">
                        {member.name.charAt(0)}
                    </div>
                    <div>
                        <div className={`font-bold text-sm ${theme.text}`}>{member.name}</div>
                        <div className={`text-[10px] ${theme.textMuted}`}>{member.email}</div>
                    </div>
                  </div>
                  {saving ? <Loader2 size={16} className="animate-spin text-purple-500" /> : <ChevronRight size={16} className={theme.iconColor} />}
                </button>
              ))}
            </div>
            
            <div className="mt-8">
                <button 
                  onClick={() => setShowModal(false)}
                  className={`w-full py-4 rounded-2xl font-black text-sm border ${theme.border} ${theme.buttonGhost}`}
                >
                    취소
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

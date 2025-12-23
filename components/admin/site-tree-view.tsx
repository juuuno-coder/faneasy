'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { UserRole } from '@/lib/types';
import { 
  ChevronRight, 
  ChevronDown, 
  Globe, 
  User, 
  MoreHorizontal, 
  FolderPlus,
  GripVertical
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

interface TreeNode extends UserData {
  children: TreeNode[];
}

interface SiteTreeViewProps {
  userRole?: UserRole; // 'super_admin' | 'owner' | 'admin' | ...
  currentSubdomain?: string; // For owners to filter their tree
  isDarkMode?: boolean;
}

export default function SiteTreeView({ userRole, currentSubdomain, isDarkMode = false }: SiteTreeViewProps) {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  
  const isSuperAdmin = userRole === 'super_admin';
  const isOwner = userRole === 'owner';
  const isDark = isDarkMode; // Sync with parent theme

  // Theme Constants
  const theme = {
    text: isDark ? 'text-gray-200' : 'text-gray-900',
    textDim: isDark ? 'text-gray-500' : 'text-gray-500',
    bgHover: isDark ? 'hover:bg-white/5' : 'hover:bg-purple-50',
    border: isDark ? 'border-white/5' : 'border-gray-100',
    iconColor: isDark ? 'text-gray-400' : 'text-gray-400',
    folderIcon: isDark ? 'text-purple-400' : 'text-purple-600',
    dragOver: isDark ? 'bg-purple-500/20 border-purple-500' : 'bg-purple-100 border-purple-500',
  };

  useEffect(() => {
    // 1. Fetch ALL users needed to build the tree
    // Ideally we fetch everything for Super Admin, or subtree for Owner.
    // For simplicity, we fetch all users and filter in memory for displaying the tree.
    // 2. Query all users (Removing orderBy to include legacy docs without createdAt)
    const q = query(collection(db, 'users'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allUsers = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as UserData[];

      // 2. Build Tree Structure
      const builtTree = buildTreeStructure(allUsers, isSuperAdmin ? undefined : currentSubdomain);
      setNodes(builtTree);
      
      // Auto-expand root nodes
      const rootIds = builtTree.map(n => n.id);
      setExpanded(prev => {
          const next = new Set(prev);
          rootIds.forEach(id => next.add(id));
          return next;
      });
    });

    return () => unsubscribe();
  }, [isSuperAdmin, currentSubdomain]);

  const buildTreeStructure = (users: UserData[], rootContext?: string): TreeNode[] => {
    const nodeMap = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    // Initialize nodes
    users.forEach(u => {
      // Key for linking: subdomain (if available) or id (for users without subdomain)
      // Actually parent refers to 'joinedSite' which is a subdomain string.
      // So we map 'subdomain' -> Node. 
      // Users without subdomain cannot be parents, but they are children.
      nodeMap.set(u.subdomain || `user_${u.id}`, { ...u, children: [] });
    });

    // Link Parent-Child
    users.forEach(u => {
        const myNodeKey = u.subdomain || `user_${u.id}`;
        const node = nodeMap.get(myNodeKey);
        if (!node) return;

        // If I have a joinedSite, find that parent
        if (u.joinedSite && nodeMap.has(u.joinedSite)) {
            const parent = nodeMap.get(u.joinedSite);
            parent?.children.push(node);
        } else {
            // No parent found in the list OR top-level
            // If we are in "Owner Mode" (rootContext is set), we only want this node if it IS the rootContext
            // OR if it's somehow top-level but arguably should be filtered out?
            // Actually, if we are restricted to `currentSubdomain`, we simply find that specific node and return it as single root.
            if (!rootContext) {
                 roots.push(node);
            }
        }
    });

    // If Owner Mode, we only return the subtree starting from currentSubdomain
    if (rootContext) {
        if (nodeMap.has(rootContext)) {
            return [nodeMap.get(rootContext)!];
        }
        return []; // Root not found
    }

    return roots;
  };

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // --- Drag & Drop Handlers ---

  const handleDragStart = (e: React.DragEvent, node: TreeNode) => {
    if (!isSuperAdmin) return; // Only Super Admin can rearrange for now
    e.dataTransfer.setData("nodeId", node.id);
    e.dataTransfer.setData("subdomain", node.subdomain || '');
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, targetNode: TreeNode) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    
    // Can only drop onto Sites (nodes with subdomain), not leaf Users
    if (!targetNode.subdomain) return;
    
    setDragOverId(targetNode.id);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetNode: TreeNode) => {
    e.preventDefault();
    setDragOverId(null);
    if (!isSuperAdmin || !targetNode.subdomain) return;

    const draggedId = e.dataTransfer.getData("nodeId");
    
    // Self check
    if (draggedId === targetNode.id) return;

    // Update Firestore
    try {
        const userRef = doc(db, 'users', draggedId);
        await updateDoc(userRef, {
            joinedSite: targetNode.subdomain,
            updatedAt: new Date()
        });
        console.log(`Moved user ${draggedId} to ${targetNode.subdomain}`);
    } catch (error) {
        console.error("Move failed:", error);
        alert("이동 실패: " + error);
    }
  };

  // --- Recursive Node Component ---
  
  const TreeItem = ({ node, level }: { node: TreeNode, level: number }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded.has(node.id);
    const isSite = !!node.subdomain;
    const isDraggingOver = dragOverId === node.id;

    return (
      <div className={`${level === 0 ? 'mb-2' : ''}`}>
        <div 
          draggable={isSuperAdmin}
          onDragStart={(e) => handleDragStart(e, node)}
          onDragOver={(e) => handleDragOver(e, node)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, node)}
          className={`
            group flex items-center gap-2 p-2 rounded-lg 
            transition-all cursor-pointer select-none
            ${theme.bgHover}
            ${isDraggingOver ? `border-2 ${theme.dragOver}` : 'border border-transparent'}
          `}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {/* Expand/Collapse Toggle */}
          <button 
            onClick={(e) => { e.stopPropagation(); toggleExpand(node.id); }}
            className={`p-0.5 rounded hover:bg-black/5 ${theme.iconColor} ${!hasChildren && 'opacity-0'}`}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {/* Icon */}
          <div className={`
             ${isSite ? theme.folderIcon : theme.iconColor} 
             ${isSuperAdmin && 'cursor-grab active:cursor-grabbing'}
          `}>
             {isSite ? <Globe size={16} /> : <User size={16} />}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
             <div className="flex items-center gap-2">
                <span className={`font-medium text-sm truncate ${theme.text}`}>
                    {node.subdomain ? node.subdomain : node.name}
                </span>
                {node.role !== 'user' && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border border-white/10 ${theme.textDim} bg-white/5`}>
                        {node.role === 'owner' ? 'OWNER' : node.role.toUpperCase()}
                    </span>
                )}
             </div>
             {isSite && node.name && node.name !== node.subdomain && (
                 <div className={`text-xs ${theme.textDim} truncate`}>{node.name}</div>
             )}
              {/* Email display for leaf users */}
             {!isSite && (
                 <div className={`text-xs ${theme.textDim} truncate`}>{node.email}</div>
             )}
          </div>
          
          {/* Action Menu (Optional) */}
          <button className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-black/5 ${theme.iconColor}`}>
             <MoreHorizontal size={14} />
          </button>
        </div>

        {/* Children */}
        {isExpanded && hasChildren && (
          <div className="border-l border-white/5 ml-4">
             {node.children.map(child => (
                 <TreeItem key={child.id} node={child} level={level + 1} />
             ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`rounded-3xl border p-6 min-h-[400px] ${isDark ? 'bg-white/5 border-white/5' : 'bg-white/60 backdrop-blur-xl border-white/40 shadow-xl'}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
           <h3 className={`text-xl font-bold ${theme.text}`}>사이트 구조도</h3>
           <p className={`text-sm ${theme.textDim}`}>
              {isSuperAdmin 
                ? '드래그 앤 드롭으로 사이트 및 회원 구조를 변경할 수 있습니다.' 
                : '내 사이트(조직)에 소속된 회원 구조입니다.'}
           </p>
        </div>
        {isSuperAdmin && (
            <div className={`text-xs px-3 py-1.5 rounded-full border ${theme.border} ${theme.textDim}`}>
                편집 가능 모드
            </div>
        )}
      </div>

      <div className="space-y-1">
        {nodes.length > 0 ? (
            nodes.map(node => (
                <TreeItem key={node.id} node={node} level={0} />
            ))
        ) : (
            <div className={`text-center py-20 ${theme.textDim}`}>
                구성원이 없습니다.
            </div>
        )}
      </div>
    </div>
  );
}

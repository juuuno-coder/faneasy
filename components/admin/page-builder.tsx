'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { SiteBlock, BlockType } from '@/lib/types';
import { getLegacyTemplate } from '@/lib/page-templates';
import { logActivity } from '@/lib/activity-logger';
import { useAuthStore } from '@/lib/store';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '@/components/shared/confirmation-modal';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Settings2, 
  Save,
  Type,
  Image as ImageIcon,
  Layout,
  MessageSquare,
  Square,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Monitor,
  Eye,
  Star,
  List,
  CreditCard,
  Zap,
  BarChart3,
  HelpCircle,
  X,
  Palette,
  Maximize2,
  Smartphone,
  History,
  RotateCcw
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TiptapEditor from '@/components/editor/tiptap-editor';
import BlockRenderer from '@/components/block-renderer';
import { motion, AnimatePresence } from 'framer-motion';

interface PageBuilderProps {
  subdomain: string;
}

export default function PageBuilder({ subdomain }: PageBuilderProps) {
  const { user } = useAuthStore();
  const [blocks, setBlocks] = useState<SiteBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeSettingsBlock, setActiveSettingsBlock] = useState<string | null>(null);
  
  const [blockToDelete, setBlockToDelete] = useState<string | null>(null);
  const [versionToRestore, setVersionToRestore] = useState<SiteBlock[] | null>(null);

  // --- Live Visual Editing State ---
  const [viewMode, setViewMode] = useState<'edit' | 'visual' | 'split'>('edit');
  const [highlightedBlockId, setHighlightedBlockId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'page_blocks', subdomain);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setBlocks(snap.data().blocks || []);
        } else {
          const legacyBlocks = getLegacyTemplate(subdomain);
          if (legacyBlocks) {
            setBlocks(legacyBlocks);
          } else {
            setBlocks([
                {
                id: 'hero-1',
                type: 'hero',
                content: { title: '환영합니다', description: '나만의 사이트를 만들어보세요', buttonText: '시작하기' },
                order: 0,
                settings: { paddingTop: '80px', paddingBottom: '80px', animation: 'slide-up', maxWidth: 'lg' }
                }
            ]);
          }
        }
      } catch (err) {
        console.error('Failed to load blocks:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [subdomain]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Create a snapshot version
      await addDoc(collection(db, 'page_blocks', subdomain, 'versions'), {
        blocks,
        createdAt: serverTimestamp(),
        description: 'Manual Save'
      });

      await setDoc(doc(db, 'page_blocks', subdomain), {
        subdomain,
        blocks,
        updatedAt: serverTimestamp()
      });
      toast.success('게시되었습니다! 히스토리에 백업되었습니다.');

      // Log Activity
      logActivity({
          userId: user?.id || 'unknown',
          userName: user?.name,
          userEmail: user?.email,
          userRole: user?.role,
          subdomain: subdomain,
          action: '페이지 디자인 저장 (PRO)',
          target: '메인 페이지',
          type: 'update',
          details: { blockCount: blocks.length, version: 'new' }
      });

    } catch (err) {
      console.error('Save failed:', err);
      toast.error('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = () => {
      if(!versionToRestore) return;
      setBlocks(versionToRestore);
      setShowHistory(false);
      setVersionToRestore(null);
      toast.success('버전이 복구되었습니다.');
  };

  const addBlock = (type: BlockType) => {
    const newBlock: SiteBlock = {
      id: `${type}-${Date.now()}`,
      type,
      content: getInitialContent(type),
      order: blocks.length,
      settings: {
        paddingTop: '60px',
        paddingBottom: '60px',
        maxWidth: 'lg',
        animation: 'fade'
      }
    };
    setBlocks([...blocks, newBlock]);
    setActiveSettingsBlock(newBlock.id);
  };

  const deleteBlock = () => {
    if (!blockToDelete) return;
    setBlocks(blocks.filter(b => b.id !== blockToDelete));
    if (activeSettingsBlock === blockToDelete) setActiveSettingsBlock(null);
    setBlockToDelete(null);
    toast.success('블록이 삭제되었습니다.');
  };

  const updateBlock = (id: string, updates: Partial<SiteBlock>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const selectBlock = (id: string) => {
    setActiveSettingsBlock(id);
    setHighlightedBlockId(id);
    
    // Scroll editor or preview if needed
    if (viewMode === 'split' || viewMode === 'edit') {
       const el = document.getElementById(`editor-block-${id}`);
       if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over?.id);
        const newOrder = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
          ...item,
          order: idx
        }));
        return newOrder;
      });
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500">데이터를 불러오는 중...</div>;

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Settings Modal Overlay */}
      <AnimatePresence>
        {activeSettingsBlock && viewMode !== 'split' && (
          <BlockSettingsPanel 
            block={blocks.find(b => b.id === activeSettingsBlock)!}
            onUpdate={(settings) => updateBlock(activeSettingsBlock, { settings })}
            onClose={() => setActiveSettingsBlock(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHistory && (
            <HistoryModal 
                subdomain={subdomain}
                onClose={() => setShowHistory(false)}
                onRestore={handleRestore}
            />
        )}
      </AnimatePresence>

      {/* Page Builder Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111] p-6 rounded-3xl border border-white/10 sticky top-0 z-50 backdrop-blur-xl transition-all shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-600 rounded-2xl shadow-lg shadow-purple-600/30">
            <Layout className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black flex items-center gap-2">
              페이지 빌더 (PRO)
              <span className="bg-purple-600/20 text-purple-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter">Live</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-black opacity-50">Visual Design System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
          <button 
            onClick={() => setViewMode('edit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'edit' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            <Settings2 size={14} /> 에디터 전용
          </button>
          <button 
            onClick={() => setViewMode('split')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'split' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            <Maximize2 size={14} /> 실시간 편집
          </button>
          <button 
            onClick={() => setViewMode('visual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'visual' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            <Eye size={14} /> 프리뷰 전용
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
           <button 
             onClick={() => setShowHistory(true)}
             className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center font-bold"
             title="버전 히스토리"
           >
             <History className="h-5 w-5" />
           </button>
           <button 
             onClick={handleSave}
             disabled={saving}
             className="px-8 py-3 rounded-2xl bg-purple-600 text-white font-black hover:bg-purple-700 transition-all shadow-xl shadow-purple-900/40 disabled:opacity-50 flex items-center justify-center gap-2 group text-sm"
           >
             <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />
             {saving ? '저장 중...' : '확정 및 게시'}
           </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${viewMode === 'edit' ? 'lg:grid-cols-4' : 'lg:grid-cols-1'} gap-8 transition-all duration-500`}>
        {/* Sidebar: Add Blocks - Only in standard edit mode */}
        {viewMode === 'edit' && (
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/5 rounded-3xl border border-white/10 p-6 sticky top-28">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 opacity-50">기본 요소</h3>
              <div className="grid grid-cols-1 gap-2 mb-8">
                <AddBlockButton icon={<Layout />} label="히어로 섹션" onClick={() => addBlock('hero')} color="purple" />
                <AddBlockButton icon={<Type />} label="리치 텍스트" onClick={() => addBlock('text')} color="blue" />
                <AddBlockButton icon={<ImageIcon />} label="이미지/갤러리" onClick={() => addBlock('image')} color="green" />
              </div>

              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 opacity-50">고급 컴포넌트</h3>
              <div className="grid grid-cols-1 gap-2 mb-8">
                <AddBlockButton icon={<Zap />} label="주요 특징" onClick={() => addBlock('features')} color="yellow" />
                <AddBlockButton icon={<CreditCard />} label="가격 정책" onClick={() => addBlock('pricing')} color="pink" />
                <AddBlockButton icon={<HelpCircle />} label="자주 묻는 질문" onClick={() => addBlock('faq')} color="indigo" />
                <AddBlockButton icon={<BarChart3 />} label="성과 지표" onClick={() => addBlock('stats')} color="cyan" />
                <AddBlockButton icon={<Star />} label="고객 후기" onClick={() => addBlock('testimonials')} color="orange" />
              </div>

              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 opacity-50">구성 요소</h3>
              <div className="grid grid-cols-1 gap-2">
                <AddBlockButton icon={<MessageSquare />} label="문의 양식" onClick={() => addBlock('form')} color="red" />
                <AddBlockButton icon={<Square />} label="여백/선" onClick={() => addBlock('spacer')} color="gray" />
              </div>
            </div>
          </div>
        )}

        {/* --- Editor / Visual Area --- */}
        <div className={`${viewMode === 'edit' ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          {viewMode === 'visual' ? (
            <div className="bg-[#0A0A0A] rounded-[48px] border border-white/10 overflow-hidden shadow-2xl min-h-[800px]">
                <BlockRenderer blocks={blocks} site={subdomain} />
            </div>
          ) : viewMode === 'split' ? (
            <div className="flex h-[85vh] gap-6 overflow-hidden">
               {/* Fixed Left Sidebar Editor */}
               <div className="w-[450px] shrink-0 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4">
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                     <h3 className="text-sm font-black text-gray-400 mb-6 uppercase flex items-center justify-between">
                        블록 구조
                        <span className="text-[10px] bg-white/10 px-2 py-1 rounded-lg font-bold">{blocks.length} Blocks</span>
                     </h3>
                     <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                           <div className="flex flex-col gap-4">
                              {blocks.map((block) => (
                                <SortableBlockItem 
                                  key={block.id} 
                                  block={block} 
                                  isActive={activeSettingsBlock === block.id}
                                  onDelete={() => setBlockToDelete(block.id)}
                                  onUpdate={(content) => updateBlock(block.id, { content })}
                                  onOpenSettings={() => selectBlock(block.id)}
                                  compact={true}
                                />
                              ))}
                           </div>
                        </SortableContext>
                     </DndContext>
                     
                     <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-2">
                        <button onClick={() => addBlock('hero')} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all">+ 히어로</button>
                        <button onClick={() => addBlock('features')} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all">+ 특징</button>
                        <button onClick={() => addBlock('text')} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all">+ 텍스트</button>
                        <button onClick={() => addBlock('image')} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all">+ 이미지</button>
                     </div>
                  </div>

                  {activeSettingsBlock && (
                    <div className="bg-[#111] p-8 rounded-[32px] border border-white/10 shadow-2xl animate-in slide-in-from-left-4 duration-300">
                      <div className="flex items-center justify-between mb-8">
                        <h4 className="text-xl font-black flex items-center gap-3">
                          <Settings2 className="text-purple-500" /> 세부 옵션
                        </h4>
                        <button onClick={() => setActiveSettingsBlock(null)} className="text-gray-500 hover:text-white">닫기</button>
                      </div>
                      <BlockSettingsPanel 
                        inline={true}
                        block={blocks.find(b => b.id === activeSettingsBlock)!}
                        onUpdate={(settings) => updateBlock(activeSettingsBlock, { settings })}
                        onClose={() => setActiveSettingsBlock(null)}
                      />
                    </div>
                  )}
               </div>

               {/* Right Side Browser Frame Preview */}
               <div className="flex-1 bg-[#0A0A0A] rounded-[48px] border-8 border-[#1A1A1A] overflow-y-auto overflow-x-hidden shadow-2xl relative custom-scrollbar group/preview">
                  <div className="sticky top-0 left-0 right-0 h-10 bg-[#1A1A1A] flex items-center px-6 gap-2 z-40">
                     <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                     </div>
                     <div className="mx-auto bg-black/40 px-4 py-1 rounded-lg text-[10px] text-gray-500 font-bold tracking-widest uppercase">
                        {subdomain}.faneasy.kr PREVIEW
                     </div>
                  </div>
                  
                  <BlockRenderer 
                    blocks={blocks} 
                    site={subdomain} 
                    isEditable={true}
                    activeBlockId={activeSettingsBlock}
                    onUpdateBlock={(id, content) => updateBlock(id, { content })}
                    onSelectBlock={(id) => selectBlock(id)}
                  />

                  {/* Visual Guides */}
                  <div className="absolute top-14 right-6 pointer-events-none opacity-0 group-hover/preview:opacity-100 transition-opacity">
                    <div className="bg-purple-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-2xl uppercase tracking-tighter">
                      Canvas Active
                    </div>
                  </div>
               </div>
            </div>
          ) : (
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={blocks.map(b => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-6">
                  {blocks.map((block) => (
                    <div key={block.id} id={`editor-block-${block.id}`}>
                      <SortableBlockItem 
                        block={block} 
                        isActive={activeSettingsBlock === block.id}
                        onDelete={() => setBlockToDelete(block.id)}
                        onUpdate={(content) => updateBlock(block.id, { content })}
                        onOpenSettings={() => selectBlock(block.id)}
                      />
                    </div>
                  ))}
                  
                  {blocks.length === 0 && (
                    <div className="p-32 border-2 border-dashed border-white/5 rounded-[48px] text-center text-gray-500 bg-white/1">
                      <Plus className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p className="font-bold text-lg">새로운 페이지를 만들어보세요.</p>
                      <p className="text-sm mt-2">왼쪽 사이드바에서 블록을 추가하여 시작할 수 있습니다.</p>
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {showHistory && (
        <HistoryModal 
          subdomain={subdomain} 
          onClose={() => setShowHistory(false)} 
          onRestore={(legacyBlocks) => setVersionToRestore(legacyBlocks)} 
        />
      )}

      <ConfirmationModal 
          isOpen={!!blockToDelete}
          onClose={() => setBlockToDelete(null)}
          onConfirm={deleteBlock}
          title="블록 삭제"
          message="정말 이 블록을 삭제하시겠습니까? 관련 데이터가 모두 삭제됩니다."
          confirmLabel="삭제하기"
          isDarkMode={true}
      />

      <ConfirmationModal 
          isOpen={!!versionToRestore}
          onClose={() => setVersionToRestore(null)}
          onConfirm={handleRestore}
          title="버전 복구"
          message="선택한 버전으로 되돌리시겠습니까? 현재 편집 중인 내용은 사라집니다."
          confirmLabel="복구하기"
          variant="warning"
          isDarkMode={true}
      />
    </div>
  );
}

function AddBlockButton({ icon, label, onClick, color }: { icon: React.ReactNode; label: string; onClick: () => void; color?: string }) {
  const colorClasses: any = {
    purple: "text-purple-400 bg-purple-400/10",
    blue: "text-blue-400 bg-blue-400/10",
    green: "text-green-400 bg-green-400/10",
    yellow: "text-yellow-400 bg-yellow-400/10",
    pink: "text-pink-400 bg-pink-400/10",
    indigo: "text-indigo-400 bg-indigo-400/10",
    cyan: "text-cyan-400 bg-cyan-400/10",
    orange: "text-orange-400 bg-orange-400/10",
    red: "text-red-400 bg-red-400/10",
    gray: "text-gray-400 bg-white/5"
  };

  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all text-gray-400 hover:text-white group"
    >
      <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${colorClasses[color || 'gray']}`}>
        {icon}
      </div>
      <span className="font-bold text-sm">{label}</span>
      <Plus size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

function BlockSettingsPanel({ 
  block, 
  onUpdate, 
  onClose,
  inline = false
}: { 
  block: SiteBlock; 
  onUpdate: (settings: any) => void; 
  onClose: () => void;
  inline?: boolean;
}) {
  const currentSettings = block.settings || {};
  
  return (
    <motion.div 
      initial={inline ? { opacity: 0 } : { x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={inline ? { opacity: 0 } : { x: 400, opacity: 0 }}
      className={inline ? "w-full space-y-8" : "fixed top-0 right-0 w-80 h-full bg-[#111] border-l border-white/10 z-50 shadow-2xl p-8 overflow-y-auto"}
    >
      {!inline && (
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-xl font-bold flex items-center gap-2">
              <Settings2 size={20} className="text-purple-500" />
              블록 설정
           </h2>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
           </button>
        </div>
      )}

      <div className="space-y-8">
        <div>
           <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 block flex items-center gap-2">
             <Layout size={14} /> 데스크탑 패딩
           </label>
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <span className="text-[10px] text-gray-500 mb-1 block">Upper Padding</span>
                 <input type="text" value={currentSettings.paddingTop || ''} onChange={(e) => onUpdate({...currentSettings, paddingTop: e.target.value})} placeholder="80px" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
              </div>
              <div>
                 <span className="text-[10px] text-gray-500 mb-1 block">Lower Padding</span>
                 <input type="text" value={currentSettings.paddingBottom || ''} onChange={(e) => onUpdate({...currentSettings, paddingBottom: e.target.value})} placeholder="80px" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
              </div>
           </div>
        </div>

        <div>
           <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 block flex items-center gap-2">
             <Smartphone size={14} /> 모바일 패딩 (기본값 제공)
           </label>
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <span className="text-[10px] text-gray-500 mb-1 block">Mobile Top</span>
                 <input type="text" value={currentSettings.mobilePaddingTop || ''} onChange={(e) => onUpdate({...currentSettings, mobilePaddingTop: e.target.value})} placeholder="40px" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
              </div>
              <div>
                 <span className="text-[10px] text-gray-500 mb-1 block">Mobile Bottom</span>
                 <input type="text" value={currentSettings.mobilePaddingBottom || ''} onChange={(e) => onUpdate({...currentSettings, mobilePaddingBottom: e.target.value})} placeholder="40px" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
              </div>
           </div>
        </div>

        <div>
           <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 block flex items-center gap-2">
             <Maximize2 size={14} /> 컨텐츠 최대 너비
           </label>
           <select 
             value={currentSettings.maxWidth || 'lg'} 
             onChange={(e) => onUpdate({...currentSettings, maxWidth: e.target.value})}
             className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500"
           >
              <option value="sm">Small (좁게)</option>
              <option value="md">Medium (보통)</option>
              <option value="lg">Large (넓게)</option>
              <option value="xl">Extra Large (매우 넓게)</option>
              <option value="full">Full Width (화면 꽉 차게)</option>
           </select>
        </div>

        <div>
           <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 block flex items-center gap-2">
             <Palette size={14} /> 디자인 무드
           </label>
           <div className="space-y-4">
              <div>
                 <span className="text-[10px] text-gray-500 mb-1 block">배경색 (HEX)</span>
                 <div className="flex gap-2">
                   <input type="color" value={currentSettings.backgroundColor || '#000000'} onChange={(e) => onUpdate({...currentSettings, backgroundColor: e.target.value})} className="h-10 w-10 p-0 bg-transparent border-none" />
                   <input type="text" value={currentSettings.backgroundColor || ''} onChange={(e) => onUpdate({...currentSettings, backgroundColor: e.target.value})} placeholder="#000000" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm" />
                 </div>
              </div>
              <div>
                 <span className="text-[10px] text-gray-500 mb-1 block">텍스트색 (HEX)</span>
                 <div className="flex gap-2">
                   <input type="color" value={currentSettings.textColor || '#FFFFFF'} onChange={(e) => onUpdate({...currentSettings, textColor: e.target.value})} className="h-10 w-10 p-0 bg-transparent border-none" />
                   <input type="text" value={currentSettings.textColor || ''} onChange={(e) => onUpdate({...currentSettings, textColor: e.target.value})} placeholder="#FFFFFF" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm" />
                 </div>
              </div>
           </div>
        </div>

        <div>
           <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 block flex items-center gap-2">
             <Zap size={14} /> 애니메이션 효과
           </label>
           <select 
             value={currentSettings.animation || 'none'} 
             onChange={(e) => onUpdate({...currentSettings, animation: e.target.value})}
             className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
           >
              <option value="none">효과 없음</option>
              <option value="fade">천천히 나타나기 (Fade)</option>
              <option value="slide-up">위로 솟아오르기 (Slide Up)</option>
              <option value="zoom">부드럽게 확대 (Zoom In)</option>
           </select>
        </div>

        <div className="pt-8 mt-8 border-t border-white/5">
           <button onClick={onClose} className="w-full py-4 bg-purple-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition-all shadow-xl shadow-purple-600/20">
              <Save size={18} />
              설정 적용 완료
           </button>
        </div>
      </div>
    </motion.div>
  );
}

function SortableBlockItem({ 
  block, 
  onDelete, 
  onUpdate, 
  onOpenSettings,
  isActive = false,
  compact = false
}: { 
  block: SiteBlock; 
  onDelete: () => void; 
  onUpdate: (content: any) => void; 
  onOpenSettings: () => void;
  isActive?: boolean;
  compact?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1
  };

  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`group bg-white/5 rounded-3xl border transition-all ${
        isDragging ? 'shadow-2xl ring-2 ring-purple-500 border-purple-500/50' : 
        isActive ? 'border-purple-500/50 bg-purple-500/5' : 
        'hover:border-white/20 border-white/10'
      }`}
    >
      <div className={`flex items-center justify-between px-6 py-4 bg-white/2 border-b border-white/5 ${compact ? 'py-3 px-4' : ''}`}>
        <div className="flex items-center gap-4">
          <div {...attributes} {...listeners} className="cursor-grab p-2 hover:bg-white/10 rounded-xl transition-colors">
            <GripVertical size={18} className="text-gray-600 group-hover:text-purple-500" />
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 bg-purple-400/10 px-2 py-1 rounded-lg">
                {block.type}
             </span>
             <h4 className="text-xs font-bold text-gray-500 group-hover:text-white transition-colors">{block.id}</h4>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/10 rounded-lg text-gray-500 transition-all"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button 
            onClick={onOpenSettings}
            className="p-2 hover:bg-purple-500/10 rounded-lg text-gray-500 hover:text-purple-400 transition-all"
            title="고급 설정"
          >
            <Settings2 size={16} />
          </button>
          <button 
            onClick={onDelete}
            className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-all"
            title="블록 삭제"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {isExpanded && !compact && (
        <div className="p-8">
          <BlockEditorFields block={block} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}

function BlockEditorFields({ block, onUpdate }: { block: SiteBlock; onUpdate: (content: any) => void }) {
  const [activeItem, setActiveItem] = useState<number | null>(null);

  switch (block.type) {
    case 'hero':
      return (
        <div className="space-y-6">
          <InputGroup label="메인 타이틀" value={block.content.title} onChange={(val) => onUpdate({...block.content, title: val})} />
          <InputGroup label="서브 설명" type="textarea" value={block.content.description} onChange={(val) => onUpdate({...block.content, description: val})} />
          <InputGroup label="버튼 문구" value={block.content.buttonText} onChange={(val) => onUpdate({...block.content, buttonText: val})} />
        </div>
      );
    
    case 'text':
      return (
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">리치 텍스트 에디터</label>
          <TiptapEditor 
             content={block.content.json} 
             onChange={(json) => onUpdate({ ...block.content, json })}
          />
        </div>
      );

    case 'image':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="이미지 URL" value={block.content.url} onChange={(val) => onUpdate({...block.content, url: val})} placeholder="https://..." />
          <InputGroup label="이미지 설명 (Alt)" value={block.content.alt} onChange={(val) => onUpdate({...block.content, alt: val})} />
        </div>
      );

    case 'features':
      return (
        <div className="space-y-6">
          <InputGroup label="섹션 제목" value={block.content.title} onChange={(val) => onUpdate({...block.content, title: val})} />
          <InputGroup label="섹션 설명" value={block.content.description} onChange={(val) => onUpdate({...block.content, description: val})} />
          <div className="border border-white/10 rounded-2xl p-6 bg-white/2">
             <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold text-gray-500 uppercase">특징 리스트</span>
                <button 
                  onClick={() => onUpdate({...block.content, items: [...(block.content.items || []), {title: 'New Feature', description: ''}]})}
                  className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300"
                >
                  <Plus size={14} /> 추가하기
                </button>
             </div>
             <div className="space-y-4">
                {block.content.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                       <input value={item.title} onChange={(e) => {
                         const newItems = [...block.content.items];
                         newItems[idx].title = e.target.value;
                         onUpdate({...block.content, items: newItems});
                       }} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-sm" placeholder="특징 제목" />
                       <input value={item.description} onChange={(e) => {
                         const newItems = [...block.content.items];
                         newItems[idx].description = e.target.value;
                         onUpdate({...block.content, items: newItems});
                       }} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-gray-400" placeholder="상세 설명" />
                    </div>
                    <button onClick={() => onUpdate({...block.content, items: block.content.items.filter((_:any, i:number) => i !== idx)})} className="p-2 text-gray-600 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
             </div>
          </div>
        </div>
      );

    case 'pricing':
      return (
        <div className="space-y-6">
          <InputGroup label="섹션 제목" value={block.content.title} onChange={(val) => onUpdate({...block.content, title: val})} />
          <div className="space-y-4">
            {block.content.plans?.map((plan: any, idx: number) => (
              <div key={idx} className="p-6 bg-white/3 border border-white/5 rounded-2xl">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-gray-500">플랜 #{idx+1}</span>
                    <button onClick={() => onUpdate({...block.content, plans: block.content.plans.filter((_:any,i:number)=>i!==idx)})} className="text-xs text-red-500">삭제</button>
                 </div>
                 <div className="grid grid-cols-2 gap-4 mb-4">
                    <input value={plan.name} onChange={(e) => {
                       const newPlans = [...block.content.plans];
                       newPlans[idx].name = e.target.value;
                       onUpdate({...block.content, plans: newPlans});
                    }} className="bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-sm" placeholder="플랜명" />
                    <input value={plan.price} onChange={(e) => {
                       const newPlans = [...block.content.plans];
                       newPlans[idx].price = e.target.value;
                       onUpdate({...block.content, plans: newPlans});
                    }} className="bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-sm" placeholder="가격" />
                 </div>
                 <div className="space-y-2 mb-4">
                   <span className="text-[10px] text-gray-500 font-bold uppercase">상세 혜택 (줄바꿈으로 구분)</span>
                    <textarea 
                      value={plan.features?.join('\n')} 
                      onChange={(e) => {
                       const newPlans = [...block.content.plans];
                       newPlans[idx].features = e.target.value.split('\n');
                       onUpdate({...block.content, plans: newPlans});
                    }} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs" rows={3} placeholder="혜택 1&#10;혜택 2" />
                 </div>
                 <label className="flex items-center gap-2 mb-4 cursor-pointer">
                    <input type="checkbox" checked={plan.popular} onChange={(e) => {
                       const newPlans = [...block.content.plans];
                       newPlans[idx].popular = e.target.checked;
                       onUpdate({...block.content, plans: newPlans});
                    }} />
                    <span className="text-xs text-gray-400 italic">추천 플랜 강조 표시</span>
                 </label>
              </div>
            ))}
            <button onClick={() => onUpdate({...block.content, plans: [...(block.content.plans || []), {name: 'Pro', price: '₩50,000', features: [], popular: false}]})} className="w-full py-3 border border-dashed border-white/10 rounded-2xl text-xs text-gray-500 hover:border-white/20 hover:text-white transition-all">+ 플랜 추가</button>
          </div>
        </div>
      );

    case 'faq':
      return (
        <div className="space-y-6">
           <InputGroup label="섹션 제목" value={block.content.title} onChange={(val) => onUpdate({...block.content, title: val})} />
           <div className="space-y-4">
              {block.content.items?.map((item: any, idx: number) => (
                <div key={idx} className="space-y-2 p-4 border border-white/5 rounded-xl bg-white/1">
                   <input value={item.question} onChange={(e) => {
                      const newItems = [...block.content.items];
                      newItems[idx].question = e.target.value;
                      onUpdate({...block.content, items: newItems});
                   }} className="w-full bg-transparent font-bold text-sm border-b border-white/5 pb-2" placeholder="질문 입력" />
                   <textarea value={item.answer} onChange={(e) => {
                      const newItems = [...block.content.items];
                      newItems[idx].answer = e.target.value;
                      onUpdate({...block.content, items: newItems});
                   }} className="w-full bg-transparent text-xs text-gray-400 py-2 resize-none" placeholder="답변 입력" rows={2} />
                   <div className="flex justify-end">
                      <button onClick={() => onUpdate({...block.content, items: block.content.items.filter((_:any,i:number)=>i!==idx)})} className="text-[10px] text-red-500">문항 삭제</button>
                   </div>
                </div>
              ))}
              <button onClick={() => onUpdate({...block.content, items: [...(block.content.items || []), {question: '', answer: ''}]})} className="w-full py-2 bg-white/5 rounded-xl text-xs text-gray-500 transition-colors hover:bg-white/10">+ 질문 추가</button>
           </div>
        </div>
      );

    case 'stats':
        return (
          <div className="grid grid-cols-2 gap-4">
             {block.content.items?.map((item: any, idx: number) => (
                <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5">
                   <input value={item.value} onChange={(e) => {
                      const newItems = [...block.content.items];
                      newItems[idx].value = e.target.value;
                      onUpdate({...block.content, items: newItems});
                   }} className="w-full bg-transparent font-black text-2xl text-purple-500" placeholder="10k+" />
                   <input value={item.label} onChange={(e) => {
                      const newItems = [...block.content.items];
                      newItems[idx].label = e.target.value;
                      onUpdate({...block.content, items: newItems});
                   }} className="w-full bg-transparent text-[10px] font-bold uppercase tracking-widest text-gray-500" placeholder="LABEL" />
                </div>
             ))}
          </div>
        );

    case 'testimonials':
        return (
          <div className="space-y-4">
             {block.content.items?.map((item: any, idx: number) => (
                <div key={idx} className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                   <textarea value={item.quote} onChange={(e) => {
                      const newItems = [...block.content.items];
                      newItems[idx].quote = e.target.value;
                      onUpdate({...block.content, items: newItems});
                   }} className="w-full bg-transparent italic text-gray-300 text-sm resize-none" placeholder="후기 내용" rows={2} />
                   <div className="grid grid-cols-2 gap-4">
                      <input value={item.author} onChange={(e) => {
                         const newItems = [...block.content.items];
                         newItems[idx].author = e.target.value;
                         onUpdate({...block.content, items: newItems});
                      }} className="bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs" placeholder="이름" />
                      <input value={item.role} onChange={(e) => {
                         const newItems = [...block.content.items];
                         newItems[idx].role = e.target.value;
                         onUpdate({...block.content, items: newItems});
                      }} className="bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs" placeholder="직책" />
                   </div>
                </div>
             ))}
             <button onClick={() => onUpdate({...block.content, items: [...(block.content.items || []), {quote: '', author: '', role: ''}]})} className="w-full py-2 bg-white/5 rounded-xl text-xs text-gray-500">+ 후기 추가</button>
          </div>
        );

    case 'form':
      return (
        <div className="space-y-4">
          <InputGroup label="문의폼 제목" value={block.content.title} onChange={(val) => onUpdate({...block.content, title: val})} />
          <InputGroup label="문의폼 설명" value={block.content.description} onChange={(val) => onUpdate({...block.content, description: val})} />
          <div>
             <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">디자인 유형 (Theme)</label>
             <select value={block.content.variant} onChange={(e) => onUpdate({...block.content, variant: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm">
                <option value="default">Default (Standard)</option>
                <option value="bold">Bold (Vibrant Purple)</option>
                <option value="clean">Clean (Minimalist)</option>
                <option value="tech">Tech (Glassmorphism)</option>
             </select>
          </div>
        </div>
      );

    case 'spacer':
        return <InputGroup label="높이 조절 (e.g. 100px)" value={block.content.height} onChange={(val) => onUpdate({...block.content, height: val})} />;

    default:
      return <div className="text-gray-500 text-xs italic">이 블록 유형은 기본적인 속성만 편집 가능합니다.</div>;
  }
}

function InputGroup({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: 'text' | 'textarea'; placeholder?: string }) {
  return (
    <div>
      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">{label}</label>
      {type === 'text' ? (
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-all text-sm"
        />
      ) : (
        <textarea 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none resize-none transition-all text-sm leading-relaxed"
          rows={3}
        />
      )}
    </div>
  );
}

function getInitialContent(type: BlockType) {
  switch (type) {
    case 'hero': return { title: '환영합니다', description: '세상을 바꾸는 혁신적인 솔루션', buttonText: '지금 시작하기' };
    case 'text': return { json: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '여기에 매력적인 스토리를 입력하세요.' }] }] } };
    case 'image': return { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop', alt: 'Sample Dashboard' };
    case 'features': return { title: '왜 우리와 함께해야 할까요?', items: [{title: '압도적인 속도', description: '기존 대비 200% 빠른 성능'}, {title: '강력한 보안', description: '군사급 암호화 적용'}, {title: '24/7 서포트', description: '언제든 준비된 전문가들'}] };
    case 'pricing': return { title: '합리적인 요금제', plans: [{name: 'Free', price: '₩0', features: ['기본 대시보드', '1개 사이트 연결'], popular: false}, {name: 'Pro', price: '₩49,000', features: ['풀 대시보드', '무제한 사이트', '프리미엄 지원'], popular: true}, {name: 'Enterprise', price: '문의', features: ['커스텀 기능', '전담 매니저'], popular: false}] };
    case 'faq': return { title: '자주 묻는 질문', items: [{question: '사용법이 어렵나요?', answer: '아니요, 5분이면 충분합니다.'}, {question: '결제 수단은 무엇이 있나요?', answer: '모든 신용카드와 계좌이체를 지원합니다.'}] };
    case 'stats': return { items: [{value: '1.2k+', label: '만족한 고객'}, {value: '25m', label: '누적 매출'}, {value: '99%', label: '가동률'}, {value: '24h', label: '고객 지원'}] };
    case 'testimonials': return { items: [{quote: '이 플랫폼 덕분에 비즈니스가 완전히 바뀌었습니다!', author: '김철수', role: '도도마케팅 대표'}, {quote: '최고의 선택이었습니다. 강력 추천합니다.', author: '이영희', role: '그로스랩 팀장'}] };
    case 'form': return { title: '무료 컨설팅 신청', description: '지금 바로 전문가와 상담하세요.', variant: 'tech' };
    case 'spacer': return { height: '80px' };
    default: return {};
  }
}
function HistoryModal({ subdomain, onClose, onRestore }: { subdomain: string; onClose: () => void; onRestore: (blocks: SiteBlock[]) => void }) {
    const [versions, setVersions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const loadHistory = async () => {
        try {
          const q = query(
              collection(db, 'page_blocks', subdomain, 'versions'), 
              orderBy('createdAt', 'desc'), 
              limit(20)
          );
          const snap = await getDocs(q);
          setVersions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      loadHistory();
    }, [subdomain]);
  
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      >
        <div className="bg-[#111] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <History className="text-purple-500" />
              버전 히스토리
            </h2>
            <button onClick={onClose}><X className="text-gray-500 hover:text-white" /></button>
          </div>
          
          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
             {loading ? (
                 <div className="text-center text-gray-500 py-12">기록을 불러오는 중...</div>
             ) : versions.length === 0 ? (
                 <div className="text-center text-gray-500 py-12">저장된 기록이 없습니다.</div>
             ) : (
                 versions.map((v) => (
                    <div key={v.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all group">
                        <div>
                            <div className="font-bold text-sm mb-1">
                                {v.createdAt?.toDate().toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                                {v.description || 'Manual Save'} • {v.blocks?.length || 0} Blocks
                            </div>
                        </div>
                        <button 
                          onClick={() => onRestore(v.blocks)}
                          className="px-4 py-2 bg-white/10 hover:bg-purple-600 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                        >
                            <RotateCcw className="h-3 w-3" />
                            복구하기
                        </button>
                    </div>
                 ))
             )}
          </div>
  
          <div className="p-6 bg-white/5 border-t border-white/10 text-xs text-gray-500 text-center">
              최근 20개의 저장 기록만 표시됩니다.
          </div>
        </div>
      </motion.div>
    );
  }

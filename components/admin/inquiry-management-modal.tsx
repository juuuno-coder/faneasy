'use client';

import { useState, useEffect } from 'react';
import type { Inquiry, InquiryWorkflowStatus, InquiryNote } from '@/lib/types';
import { 
  X, 
  Phone, 
  Mail, 
  Building2, 
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  ChevronRight,
  Plus,
  Save,
  Trash2
} from 'lucide-react';
import { db } from '@/lib/firebaseClient';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { logActivity } from '@/lib/activity-logger';
import { useAuthStore } from '@/lib/store';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '@/components/shared/confirmation-modal';

interface Props {
  inquiry: Inquiry;
  onClose: () => void;
  onUpdate: (updated: Inquiry) => void;
  isDarkMode: boolean;
}

const WORKFLOW_STEPS: { status: InquiryWorkflowStatus; label: string; color: string }[] = [
  { status: 'received', label: '문의 접수 확인', color: 'bg-gray-500' },
  { status: 'first_call', label: '1차 유선 상담', color: 'bg-blue-500' },
  { status: 'kakao_progress', label: '카톡 진행사항 안내', color: 'bg-green-500' },
  { status: 'signup_order', label: '회원가입 + 주문서', color: 'bg-purple-500' },
  { status: 'payment_received', label: '초기세팅비 입금', color: 'bg-yellow-500' },
  { status: 'in_progress', label: '작업 진행', color: 'bg-orange-500' },
  { status: 'review', label: '중간 검수', color: 'bg-pink-500' },
  { status: 'completed', label: '완료', color: 'bg-teal-500' },
  { status: 'subscription_active', label: '구독료 발생 중', color: 'bg-indigo-500' },
];

export default function InquiryManagementModal({ inquiry, onClose, onUpdate, isDarkMode }: Props) {
  const { user: currentUser } = useAuthStore();
  const [currentStatus, setCurrentStatus] = useState<InquiryWorkflowStatus>(
    inquiry.workflowStatus || 'received'
  );
  const [notes, setNotes] = useState<InquiryNote[]>(inquiry.notes || []);
  const [newNote, setNewNote] = useState('');
  const [completedAt, setCompletedAt] = useState(inquiry.completedAt || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'progress' | 'original'>('progress');

  const isDark = isDarkMode;
  const t = {
    bg: isDark ? 'bg-[#111] border-white/10' : 'bg-white border-gray-100',
    header: isDark ? 'bg-linear-to-r from-purple-950/30 to-indigo-950/30 border-white/5' : 'bg-linear-to-r from-purple-50 to-indigo-50 border-gray-100',
    text: isDark ? 'text-white' : 'text-gray-900',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
    textDim: isDark ? 'text-gray-300' : 'text-gray-700',
    card: isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200',
    panel: isDark ? 'bg-black/20' : 'bg-gray-50',
    input: isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400',
    divider: isDark ? 'border-white/5' : 'border-gray-100',
  };

  const currentStepIndex = WORKFLOW_STEPS.findIndex(s => s.status === currentStatus);

  // ESC Key Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Phone Number Formatter
  const formatPhoneNumber = (phone: string) => {
      if (!phone) return '';
      const cleaned = phone.replace(/\D/g, '');
      if (cleaned.length === 11) {
          return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      }
      return phone;
  };

  const handleStatusChange = async (newStatus: InquiryWorkflowStatus) => {
    // Optimistic Update
    const prevStatus = currentStatus;
    setCurrentStatus(newStatus);
    
    // Auto-set completed date if status is 'completed'
    let newCompletedAt = completedAt;
    if (newStatus === 'completed' && !completedAt) {
      newCompletedAt = new Date().toISOString().split('T')[0];
      setCompletedAt(newCompletedAt);
    }

    // Immediate Save for Status Change
    try {
        const timeline = [...(inquiry.timeline || [])];
        timeline.push({
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: '상태 변경됨'
        });

        const docRef = doc(db, 'inquiries', inquiry.id);
        
        // Build update data object without 'undefined'
        const updateData: any = {
            workflowStatus: newStatus,
            timeline,
            updatedAt: new Date().toISOString()
        };

        // Date Logic
        if (newStatus === 'completed') {
            const dateStr = newCompletedAt || new Date().toISOString().split('T')[0];
            updateData.completedAt = dateStr;
            updateData.status = 'completed'; // legacy sync
            
            const nextDay = new Date(dateStr);
            nextDay.setDate(nextDay.getDate() + 1);
            updateData.subscriptionStartDate = nextDay.toISOString().split('T')[0];
        } else {
            // Provide null if undefined to satisfy Firestore
            updateData.completedAt = inquiry.completedAt || null;
            updateData.subscriptionStartDate = inquiry.subscriptionStartDate || null;
        }

        await updateDoc(docRef, updateData);

        // 1-2. Log Activity
        if (currentUser) {
            const stepLabel = WORKFLOW_STEPS.find(s => s.status === newStatus)?.label || newStatus;
            await logActivity({
                type: 'reply',
                userId: currentUser.id,
                userName: currentUser.name,
                userEmail: currentUser.email,
                action: '문의 상태 변경',
                target: `${inquiry.name}님: ${stepLabel}`,
                subdomain: currentUser.subdomain || (inquiry as any).siteDomain
            });
        }
        
        // Notify parent
        onUpdate({ 
            ...inquiry, 
            ...updateData,
            status: updateData.status || inquiry.status
        });

    } catch(e: any) {
        console.error("Status update failed", e);
        setCurrentStatus(prevStatus); // Revert
        toast.error("상태 저장 실패: " + (e.message || e));
    }
  };

  const handleDeleteInquiry = async () => {
    setIsSaving(true);
    try {
        const docRef = doc(db, 'inquiries', inquiry.id);
        await deleteDoc(docRef);
        
        if (currentUser) {
            await logActivity({
                type: 'reply',
                userId: currentUser.id,
                userName: currentUser.name,
                userEmail: currentUser.email,
                action: '문의 삭제',
                target: `${inquiry.name}님의 문의 삭제`,
                subdomain: currentUser.subdomain || (inquiry as any).siteDomain
            });
        }
        
        toast.success("문의가 삭제되었습니다.");
        onClose();
        // Since we deleted it, the parent list might need a refresh or filter out this ID.
        // We'll pass a special indicator if needed, but usually onUpdate or similar handles it.
        // For now, simple close. The parent should have onSnapshot anyway.
    } catch (e: any) {
        console.error("Delete failed", e);
        toast.error("삭제 실패: " + (e.message || e));
    } finally {
        setIsSaving(false);
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const note: InquiryNote = {
      id: `note-${Date.now()}`,
      content: newNote,
      createdAt: new Date().toISOString(),
      createdBy: 'admin' 
    };
    
    setNotes([...notes, note]);
    setNewNote('');
  };

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, 'inquiries', inquiry.id);
      await updateDoc(docRef, {
        notes,
        completedAt, // Save manual changes to dates too
        updatedAt: new Date().toISOString()
      });
      onUpdate({ ...inquiry, notes, completedAt, workflowStatus: currentStatus });
      toast.success('저장되었습니다!');
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error('저장 실패: ' + (error.message || error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className={`${t.bg} rounded-3xl w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 border-b ${t.header} flex justify-between items-start shrink-0`}>
          <div>
            <h3 className={`text-2xl font-bold ${t.text} mb-1`}>프로젝트 관리</h3>
            <p className={`text-sm ${t.textMuted}`}>{inquiry.name} · {formatPhoneNumber(inquiry.email)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
                onClick={() => setShowDeleteModal(true)}
                className={`p-2 hover:${isDark ? 'bg-red-500/10' : 'bg-red-50'} text-gray-400 hover:text-red-500 rounded-full transition-colors`}
                title="문의 삭제"
            >
                <Trash2 className="h-6 w-6" />
            </button>
            <button onClick={onClose} className={`p-2 hover:${isDark ? 'bg-white/10' : 'bg-white'} rounded-full transition-colors`}>
                <X className={`h-6 w-6 ${t.textMuted}`} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left: Customer Info & Timeline */}
          <div className={`w-1/3 border-r ${t.divider} p-6 overflow-y-auto ${t.panel}`}>
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className={`text-sm font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase mb-3`}>고객 정보</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className={`${t.textDim} font-mono tracking-wide`}>{formatPhoneNumber(inquiry.phone)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className={t.textDim}>{inquiry.email}</span>
                  </div>
                  {inquiry.company && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className={t.textDim}>{inquiry.company}</span>
                    </div>
                  )}
                  <div className={`mt-4 p-3 ${t.card} rounded-lg`}>
                    <div className={`text-xs ${t.textMuted} mb-1`}>희망 플랜</div>
                    <div className="text-sm font-bold text-purple-600 uppercase">{inquiry.plan}</div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className={`text-sm font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase mb-3`}>진행 이력</h4>
                <div className="space-y-2">
                  {(inquiry.timeline || []).slice().reverse().map((item, i) => { // Reverse to show newest first
                    const step = WORKFLOW_STEPS.find(s => s.status === item.status);
                    return (
                      <div key={i} className="flex gap-3 text-xs">
                        <div className={`h-6 w-6 rounded-full ${step?.color || 'bg-gray-400'} flex items-center justify-center text-white shrink-0`}>
                          <CheckCircle2 className="h-3 w-3" />
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium ${t.text}`}>{step?.label}</div>
                          <div className={t.textMuted}>{new Date(item.timestamp).toLocaleString('ko-KR')}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Important Dates */}
              {(completedAt || inquiry.subscriptionStartDate) && (
                <div>
                  <h4 className={`text-sm font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase mb-3`}>중요 날짜</h4>
                  <div className="space-y-2 text-sm">
                    {completedAt && (
                      <div className="flex justify-between">
                        <span className={t.textMuted}>완료일</span>
                        <span className={`font-medium ${t.text}`}>{completedAt}</span>
                      </div>
                    )}
                    {inquiry.subscriptionStartDate && (
                      <div className="flex justify-between">
                        <span className={t.textMuted}>구독 시작일</span>
                        <span className="font-medium text-green-500">{inquiry.subscriptionStartDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Status & Notes */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs Header */}
            <div className={`flex border-b ${t.divider} shrink-0`}>
              <button
                onClick={() => setActiveTab('progress')}
                className={`px-8 py-4 text-sm font-bold transition-all relative ${
                  activeTab === 'progress' ? 'text-purple-600' : t.textMuted
                }`}
              >
                진행 및 상담 관리
                {activeTab === 'progress' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('original')}
                className={`px-8 py-4 text-sm font-bold transition-all relative ${
                  activeTab === 'original' ? 'text-purple-600' : t.textMuted
                }`}
              >
                원문 및 상세정보
                {activeTab === 'original' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t-full" />
                )}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'progress' ? (
                <>
                  {/* Workflow Status */}
                  <div className="mb-8">
                    <h4 className={`text-sm font-bold ${t.textDim} mb-4 flex items-center gap-2`}>
                      <Clock className="h-4 w-4" />
                      진행 단계 (클릭 시 자동 저장)
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {WORKFLOW_STEPS.map((step, index) => {
                        const isActive = step.status === currentStatus;
                        const isPast = index < currentStepIndex;
                        
                        return (
                          <button
                            key={step.status}
                            onClick={() => handleStatusChange(step.status)}
                            className={`p-4 rounded-xl text-xs font-medium transition-all border-2 relative overflow-hidden group ${
                              isActive 
                                ? `${step.color} text-white border-transparent shadow-lg scale-[1.02]` 
                                : isPast
                                ? `${isDark ? 'bg-white/5 text-gray-500 border-white/5' : 'bg-gray-50 text-gray-500 border-gray-100'}`
                                : `${isDark ? 'bg-white/2 text-gray-600 border-white/5' : 'bg-white text-gray-600 border-gray-100'} hover:border-purple-300`
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2 relative z-10">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : (isDark ? 'bg-white/10' : 'bg-gray-200/50')}`}>
                                  STEP {index + 1}
                              </span>
                              {isPast && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                              {isActive && <div className="animate-pulse w-2 h-2 rounded-full bg-white"></div>}
                            </div>
                            <div className={`text-sm font-bold relative z-10 ${isActive ? 'text-white' : (isDark ? 'text-gray-400' : 'text-gray-700')}`}>
                                {step.label}
                            </div>
                            {isPast && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500/20"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Completion Date (if status is completed) */}
                  {currentStatus === 'completed' && (
                    <div className={`mb-6 p-4 ${isDark ? 'bg-teal-500/10 border-teal-500/30' : 'bg-teal-50 border-teal-200'} rounded-xl border`}>
                      <label className={`block text-sm font-bold ${isDark ? 'text-teal-400' : 'text-teal-900'} mb-2`}>
                        <Calendar className="h-4 w-4 inline mr-1" />
                        완료일 설정
                      </label>
                      <input
                        type="date"
                        value={completedAt}
                        onChange={(e) => setCompletedAt(e.target.value)}
                        className={`w-full px-3 py-2 ${isDark ? 'bg-black/40 border-teal-500/50 text-white' : 'border-teal-300'} border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none`}
                      />
                      <p className={`text-xs ${isDark ? 'text-teal-500/80' : 'text-teal-700'} mt-2`}>
                        💡 구독 시작일은 완료일 다음날로 자동 설정됩니다.
                      </p>
                    </div>
                  )}

                  {/* Notes Section */}
                  <div className="flex flex-col min-h-[300px]">
                    <h4 className={`text-sm font-bold ${t.textDim} mb-4 flex items-center gap-2`}>
                      <MessageSquare className="h-4 w-4" />
                      상담 메모
                    </h4>
                    
                    <div className="flex-1 space-y-3 mb-6">
                      {notes.map((note) => (
                        <div key={note.id} className={`p-4 ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'} rounded-xl border relative group hover:border-purple-200 transition-colors`}>
                          <div className={`text-sm ${t.textDim} whitespace-pre-wrap leading-relaxed`}>{note.content}</div>
                          <div className="text-[10px] text-gray-400 mt-2 flex justify-between items-center">
                            <span>{new Date(note.createdAt).toLocaleString('ko-KR')}</span>
                            <span>by {note.createdBy}</span>
                          </div>
                        </div>
                      ))}
                      {notes.length === 0 && (
                          <div className={`text-center py-10 ${t.textMuted} text-sm ${isDark ? 'bg-white/2' : 'bg-gray-50/50'} rounded-xl border border-dashed ${t.divider}`}>
                              작성된 메모가 없습니다.
                          </div>
                      )}
                    </div>

                    <div className={`space-y-3 pt-6 border-t ${t.divider}`}>
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="통화 내용, 진행 사항, 특이사항 등을 기록하세요..."
                        rows={3}
                        className={`w-full px-4 py-3 border ${t.divider} rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none text-sm transition-shadow ${t.textDim} ${isDark ? 'bg-black/40' : 'bg-white'} placeholder-gray-500`}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAddNote();
                            }
                        }}
                      />
                      <button
                        onClick={handleAddNote}
                        disabled={!newNote.trim()}
                        className={`w-full py-4 ${isDark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-900 hover:bg-black'} text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg`}
                      >
                        <Plus className="h-4 w-4" />
                        메모 목록에 추가
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Tab 2: Original Inquiry Details */
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className={`p-6 ${t.card} rounded-2xl`}>
                      <h5 className={`text-xs font-bold ${t.textMuted} uppercase mb-4`}>고객 기본 정보</h5>
                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-gray-400 mb-1">성함 / 상호명</div>
                          <div className={`text-lg font-bold ${t.text}`}>{inquiry.name} {inquiry.company ? `(${inquiry.company})` : ''}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">연락처</div>
                          <div className={`text-sm font-medium ${t.text}`}>{formatPhoneNumber(inquiry.phone)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">이메일</div>
                          <div className={`text-sm font-medium ${t.text}`}>{inquiry.email || '-'}</div>
                        </div>
                        {(inquiry as any).address && (
                          <div>
                            <div className="text-xs text-gray-400 mb-1">지역 / 주소</div>
                            <div className={`text-sm font-medium ${t.text}`}>{(inquiry as any).address}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className={`p-6 ${t.card} rounded-2xl`}>
                      <h5 className={`text-xs font-bold ${t.textMuted} uppercase mb-4`}>신청 정보</h5>
                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-gray-400 mb-1">신청 플랜</div>
                          <div className="text-sm font-bold text-orange-600 uppercase italic">{inquiry.plan} PLAN</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">접수 시각</div>
                          <div className={`text-sm font-medium ${t.text}`}>
                            {new Date(inquiry.createdAt).toLocaleString('ko-KR')}
                          </div>
                        </div>
                        {(inquiry as any).siteDomain && (
                          <div>
                            <div className="text-xs text-gray-400 mb-1">유입 도메인</div>
                            <div className={`text-sm font-medium ${t.text}`}>{(inquiry as any).siteDomain}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Multi-Select Answers (Goals / Current Marketing) */}
                  {((inquiry as any).goals?.length > 0 || (inquiry as any).currentMarketing?.length > 0) && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {(inquiry as any).goals?.length > 0 && (
                        <div className={`p-6 ${t.card} rounded-2xl`}>
                          <h5 className={`text-xs font-bold ${t.textMuted} uppercase mb-4`}>마케팅 목표</h5>
                          <div className="flex flex-wrap gap-2">
                            {(inquiry as any).goals.map((goal: string, idx: number) => (
                              <span key={idx} className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-xs font-bold">
                                {goal}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {(inquiry as any).currentMarketing?.length > 0 && (
                        <div className={`p-6 ${t.card} rounded-2xl`}>
                          <h5 className={`text-xs font-bold ${t.textMuted} uppercase mb-4`}>현재 진행 중인 마케팅</h5>
                          <div className="flex flex-wrap gap-2">
                            {(inquiry as any).currentMarketing.map((item: string, idx: number) => (
                              <span key={idx} className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-bold">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Original Content */}
                  <div className={`p-6 ${t.card} rounded-2xl`}>
                    <h5 className={`text-xs font-bold ${t.textMuted} uppercase mb-4`}>상세 문의 내용 (원문)</h5>
                    <div className={`text-base leading-relaxed ${t.textDim} whitespace-pre-wrap`}>
                      {inquiry.message || '입력된 상세 내용이 없습니다.'}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Footer - Always Visible */}
        <div className={`p-4 ${isDark ? 'bg-black/40 border-white/10' : 'bg-white border-gray-100'} border-t flex gap-3 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20`}>
          <button 
            onClick={onClose}
            className={`flex-1 py-4 px-4 ${isDark ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} rounded-xl font-bold transition-colors text-lg`}
          >
            닫기 (ESC)
          </button>
          <button 
            onClick={handleSaveNotes}
            disabled={isSaving}
            className="flex-[2] py-4 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-lg shadow-xl shadow-purple-200"
          >
            <Save className="h-6 w-6" />
            {isSaving ? '저장 중...' : '메모 및 변경사항 저장'}
          </button>
        </div>
      </div>

      <ConfirmationModal 
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteInquiry}
          title="문의 삭제"
          message="이 문의 내역을 정말 삭제하시겠습니까? 삭제된 내역은 복구할 수 없습니다."
          confirmLabel="삭제하기"
          isDarkMode={isDark}
      />
    </div>
  );
}

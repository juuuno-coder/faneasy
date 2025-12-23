'use client';

import { useState } from 'react';
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
  Save
} from 'lucide-react';
import { db } from '@/lib/firebaseClient';
import { doc, updateDoc } from 'firebase/firestore';

interface Props {
  inquiry: Inquiry;
  onClose: () => void;
  onUpdate: (updated: Inquiry) => void;
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

export default function InquiryManagementModal({ inquiry, onClose, onUpdate }: Props) {
  const [currentStatus, setCurrentStatus] = useState<InquiryWorkflowStatus>(
    inquiry.workflowStatus || 'received'
  );
  const [notes, setNotes] = useState<InquiryNote[]>(inquiry.notes || []);
  const [newNote, setNewNote] = useState('');
  const [completedAt, setCompletedAt] = useState(inquiry.completedAt || '');
  const [isSaving, setIsSaving] = useState(false);

  const currentStepIndex = WORKFLOW_STEPS.findIndex(s => s.status === currentStatus);

  const handleStatusChange = (newStatus: InquiryWorkflowStatus) => {
    setCurrentStatus(newStatus);
    
    // Auto-set completed date if status is 'completed'
    if (newStatus === 'completed' && !completedAt) {
      setCompletedAt(new Date().toISOString().split('T')[0]);
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const note: InquiryNote = {
      id: `note-${Date.now()}`,
      content: newNote,
      createdAt: new Date().toISOString(),
      createdBy: 'admin' // TODO: Get from auth
    };
    
    setNotes([...notes, note]);
    setNewNote('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const timeline = inquiry.timeline || [];
      
      // Add timeline entry if status changed
      if (currentStatus !== inquiry.workflowStatus) {
        timeline.push({
          status: currentStatus,
          timestamp: new Date().toISOString(),
          note: notes[notes.length - 1]?.content || undefined
        });
      }

      // Calculate subscription start date (day after completion)
      let subscriptionStartDate = inquiry.subscriptionStartDate;
      if (currentStatus === 'completed' && completedAt) {
        const nextDay = new Date(completedAt);
        nextDay.setDate(nextDay.getDate() + 1);
        subscriptionStartDate = nextDay.toISOString().split('T')[0];
      }

      const updatedInquiry: Inquiry = {
        ...inquiry,
        workflowStatus: currentStatus,
        notes,
        timeline,
        completedAt: currentStatus === 'completed' ? completedAt : inquiry.completedAt,
        subscriptionStartDate,
        updatedAt: new Date()
      };

      // Update Firestore
      const docRef = doc(db, 'inquiries', inquiry.id);
      await updateDoc(docRef, {
        workflowStatus: currentStatus,
        notes,
        timeline,
        completedAt: updatedInquiry.completedAt,
        subscriptionStartDate,
        updatedAt: new Date().toISOString()
      });

      onUpdate(updatedInquiry);
      alert('저장되었습니다!');
    } catch (error) {
      console.error('Save error:', error);
      alert('저장 실패. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gradient-to-r from-purple-50 to-indigo-50">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">프로젝트 관리</h3>
            <p className="text-sm text-gray-500">{inquiry.name} · {inquiry.email}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {/* Left: Customer Info & Timeline */}
          <div className="w-1/3 border-r border-gray-100 p-6 overflow-y-auto bg-gray-50">
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase mb-3">고객 정보</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{inquiry.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{inquiry.email}</span>
                  </div>
                  {inquiry.company && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{inquiry.company}</span>
                    </div>
                  )}
                  <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">선택 플랜</div>
                    <div className="text-sm font-bold text-purple-600 uppercase">{inquiry.plan}</div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase mb-3">진행 이력</h4>
                <div className="space-y-2">
                  {(inquiry.timeline || []).map((item, i) => {
                    const step = WORKFLOW_STEPS.find(s => s.status === item.status);
                    return (
                      <div key={i} className="flex gap-3 text-xs">
                        <div className={`h-6 w-6 rounded-full ${step?.color || 'bg-gray-400'} flex items-center justify-center text-white shrink-0`}>
                          <CheckCircle2 className="h-3 w-3" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{step?.label}</div>
                          <div className="text-gray-500">{new Date(item.timestamp).toLocaleString('ko-KR')}</div>
                          {item.note && <div className="text-gray-600 mt-1">{item.note}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Important Dates */}
              {(completedAt || inquiry.subscriptionStartDate) && (
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase mb-3">중요 날짜</h4>
                  <div className="space-y-2 text-sm">
                    {completedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">완료일</span>
                        <span className="font-medium">{completedAt}</span>
                      </div>
                    )}
                    {inquiry.subscriptionStartDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">구독 시작일</span>
                        <span className="font-medium text-green-600">{inquiry.subscriptionStartDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Status & Notes */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Workflow Status */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-700 mb-3">진행 단계</h4>
              <div className="grid grid-cols-3 gap-2">
                {WORKFLOW_STEPS.map((step, index) => {
                  const isActive = step.status === currentStatus;
                  const isPast = index < currentStepIndex;
                  
                  return (
                    <button
                      key={step.status}
                      onClick={() => handleStatusChange(step.status)}
                      className={`p-3 rounded-xl text-xs font-medium transition-all border-2 ${
                        isActive 
                          ? `${step.color} text-white border-transparent shadow-lg` 
                          : isPast
                          ? 'bg-gray-100 text-gray-500 border-gray-200'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] opacity-70">{index + 1}</span>
                        {isPast && <CheckCircle2 className="h-3 w-3" />}
                      </div>
                      {step.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Completion Date (if status is completed) */}
            {currentStatus === 'completed' && (
              <div className="mb-6 p-4 bg-teal-50 rounded-xl border border-teal-200">
                <label className="block text-sm font-bold text-teal-900 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  완료일 설정
                </label>
                <input
                  type="date"
                  value={completedAt}
                  onChange={(e) => setCompletedAt(e.target.value)}
                  className="w-full px-3 py-2 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <p className="text-xs text-teal-700 mt-2">
                  💡 구독 시작일은 완료일 다음날로 자동 설정됩니다.
                </p>
              </div>
            )}

            {/* Notes Section */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                상담 메모
              </h4>
              
              {/* Existing Notes */}
              <div className="space-y-3 mb-4">
                {notes.map((note) => (
                  <div key={note.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</div>
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(note.createdAt).toLocaleString('ko-KR')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Note */}
              <div className="space-y-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="통화 내용, 진행 사항, 특이사항 등을 기록하세요..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none text-sm"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  메모 추가
                </button>
              </div>
            </div>

            {/* Original Message */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">최초 문의 내용</h4>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap">
                {inquiry.message}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-colors"
          >
            닫기
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="h-5 w-5" />
            {isSaving ? '저장 중...' : '변경사항 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}

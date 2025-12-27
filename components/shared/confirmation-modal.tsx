'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isDarkMode?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  variant = 'danger',
  isDarkMode = false
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const colors = {
    danger: {
      bg: isDarkMode ? 'bg-red-500/10' : 'bg-red-50',
      icon: 'text-red-500',
      button: 'bg-red-600 hover:bg-red-700 shadow-red-900/20',
    },
    warning: {
      bg: isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50',
      icon: 'text-amber-500',
      button: 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/20',
    },
    info: {
      bg: isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50',
      icon: 'text-blue-500',
      button: 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/20',
    }
  };

  const currentVariant = colors[variant];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={`relative w-full max-w-md overflow-hidden rounded-3xl border shadow-2xl ${
            isDarkMode ? 'bg-[#121214] border-white/10' : 'bg-white border-gray-100'
          }`}
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${currentVariant.bg}`}>
                <AlertCircle className={`h-6 w-6 ${currentVariant.icon}`} />
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {title}
                </h3>
                <p className={`mt-2 text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {message}
                </p>
              </div>
              <button 
                onClick={onClose}
                className={`rounded-full p-1 transition-colors ${isDarkMode ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-gray-100 text-gray-400'}`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={onClose}
                className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all border ${
                  isDarkMode 
                    ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {cancelLabel}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 rounded-xl py-3 text-sm font-bold text-white transition-all shadow-lg ${currentVariant.button}`}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

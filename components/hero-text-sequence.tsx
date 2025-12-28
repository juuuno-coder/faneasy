'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export function HeroTextSequence() {
  const [phase, setPhase] = useState(1); // 1: first text, 2: second text
  const [showFooter, setShowFooter] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    // Phase 1: Speed improved by 1.5x (4 seconds instead of 6)
    const timer1 = setTimeout(() => {
      setPhase(2);
    }, 4000);

    // Footer: Show after roughly 10 seconds total (delayed by user request)
    const timer2 = setTimeout(() => {
      setShowFooter(true);
    }, 10000);

    // Scroll: Show after roughly 11 seconds total
    const timer3 = setTimeout(() => {
      setShowScroll(true);
    }, 11000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <span className="inline-block px-4 py-2 lg:px-6 lg:py-3 bg-orange-700/20 backdrop-blur-md text-orange-600 rounded-full text-sm lg:text-base font-bold mb-8 border border-orange-700/30">
        현재 300개 프랜차이즈 지점 마케팅 관리 중
      </span>

      {/* Fixed height container to prevent position shift */}
      <div className="min-h-[300px] md:min-h-[350px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === 1 && (
            <motion.div
              key="phase1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-black leading-[1.2] text-white space-y-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <span className="text-gray-400">혹시 프랜차이즈라서</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                >
                  마케팅이 필요없다고 생각하시나요?
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 4.3, duration: 0.6 }}
                >
                  
                </motion.div>
              </h1>
            </motion.div>
          )}

          {phase === 2 && (
            <motion.div
              key="phase2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-black leading-[1.2] text-white space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="text-gray-300"
                >
                  브랜드는 같아도,
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.4 }}
                  className="text-white"
                >
                  성과는 지점마다 다릅니다.
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.7, duration: 0.4 }}
                  className="text-gray-300"
                >
                  우리는{' '}
                  <span className="text-orange-600">'선택'받는 지역장악 구조</span>
                  를 만듭니다.
                </motion.div>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed height container for footer text and scroll - prevents layout shift */}
      <div className="relative h-32 flex flex-col items-center justify-start">
        {/* Footer text with blink animation */}
        <AnimatePresence>
          {showFooter && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-sm text-gray-400 animate-pulse"
            >
              불필요한 영업 없이, 가능/불가능 먼저 안내해 드립니다
            </motion.p>
          )}
        </AnimatePresence>

        {/* Scroll Indicator */}
        <AnimatePresence>
          {showScroll && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-8 flex flex-col items-center gap-2 opacity-50"
            >
              <span className="text-white text-xs font-bold tracking-widest">SCROLL</span>
              <ChevronDown className="h-6 w-6 text-white animate-bounce" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

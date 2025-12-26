'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function RotatingOuterRing() {
  return (
    <div className="relative w-80 h-80 mx-auto p-4 pointer-events-none">
      {/* 1. Outer dot-dash ring (Rotating Counter-Clockwise) */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0"
      >
        <svg viewBox="-10 -10 120 120" className="w-full h-full overflow-visible">
          <circle
            cx="50"
            cy="50"
            r="52"
            fill="none"
            stroke="#FFE5D9"
            strokeWidth="0.6"
            strokeDasharray="1.5 3"
            opacity="0.5"
          />
          
          {/* Rotation indicator dots - Delicate and moved further out */}
          <circle cx="50" cy="-6" r="2.5" fill="#FF6B35" opacity="0.8" />
          <circle cx="106" cy="50" r="2.5" fill="#FF6B35" opacity="0.4" />
          <circle cx="50" cy="106" r="2.5" fill="#FF6B35" opacity="0.8" />
          <circle cx="-6" cy="50" r="2.5" fill="#FF6B35" opacity="0.4" />
        </svg>
      </motion.div>
    </div>
  );
}

export function RotatingBizonO() {
  return (
    <div className="relative w-72 h-72 mx-auto p-4">
      {/* 2. Main Center Circle & Logo (Rotating Clockwise in Place) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Background Glow & Solid Circle - Removed bg-white to enable transparency */}
          <div className="absolute inset-0 rounded-full shadow-2xl"></div>
          
          {/* Main Success Cycle Logo (Clockwise Rotation) */}
          <motion.div
            className="relative w-full h-full flex items-center justify-center p-2"
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Image
              src="/bizon-cycle.png"
              alt="BizOn Success Cycle"
              width={600}
              height={600}
              className="object-contain filter drop-shadow-2xl"
              priority
            />
          </motion.div>
          
          {/* Decorative inner ring (Optional, for extra polish) */}
          <div className="absolute inset-0 rounded-full ring-1 ring-gray-100 ring-inset pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}

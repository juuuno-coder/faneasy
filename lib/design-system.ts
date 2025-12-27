/**
 * FanEasy Design System Constants
 * 
 * This file centralizes the design tokens and system preferences 
 * to ensure consistency across Next.js, Tailwind CSS, and Aceternity UI.
 */

export const DESIGN_SYSTEM = {
  // Brand Colors
  colors: {
    primary: {
      DEFAULT: '#8b5cf6', // Main Purple
      soft: 'rgba(139, 92, 246, 0.09)',
      border: 'rgba(139, 92, 246, 0.18)',
    },
    background: {
      light: '#f8fafc',
      dark: '#0a0a0a',
      card: '#ffffff',
    },
    text: {
      primary: '#111827',
      muted: '#6b7280',
      dark: '#ededed',
    }
  },

  // Typography (Pretendard & Poppins)
  fonts: {
    main: 'var(--font-main)',
    poppins: 'var(--font-poppins)',
  },

  // Border Radius Patterns
  radius: {
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    '3xl': '2.5rem',
  },

  // Common Animation Settings (for Frame Motion / Aceternity)
  animations: {
    duration: {
      fast: 0.2,
      normal: 0.3,
      slow: 0.5,
      verySlow: 2,
    },
    ease: {
      primary: [0.4, 0.0, 0.2, 1], // Aceternity style easing
    }
  },

  // Glassmorphism Presets
  glass: {
    light: 'bg-white/10 backdrop-blur-md border border-white/20',
    dark: 'bg-black/40 backdrop-blur-xl border border-white/10',
  }
};

/**
 * Utility to get current theme state (simplified)
 * This helps syncing with isDarkMode logic in components.
 */
export const getThemeColors = (isDarkMode: boolean) => {
  return isDarkMode 
    ? {
        bg: 'bg-[#0a0a0a]',
        text: 'text-[#ededed]',
        card: 'bg-white/5 border-white/10',
        mutedText: 'text-gray-400',
      }
    : {
        bg: 'bg-[#f8fafc]',
        text: 'text-[#111827]',
        card: 'bg-white border-gray-200 shadow-sm',
        mutedText: 'text-gray-500',
      };
};

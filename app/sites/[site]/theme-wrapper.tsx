'use client';

import { useEffect } from 'react';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc } from 'firebase/firestore';
import type { SiteSettings } from '@/lib/types';

export default function ThemeWrapper({ site }: { site: string }) {
  useEffect(() => {
    const applyTheme = async () => {
      try {
        const docRef = doc(db, 'site_settings', site);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const settings = docSnap.data() as SiteSettings;

          // Apply Primary Color
          if (settings.primaryColor) {
            document.documentElement.style.setProperty('--primary', settings.primaryColor);
            // Also try to override Tailwind colors if using CSS variables approach
            // For now, simpler direct manipulation or style tag injection
            
            // Create or update a style tag for deeper overrides
            const styleId = 'faneasy-dynamic-theme';
            let styleTag = document.getElementById(styleId);
            if (!styleTag) {
              styleTag = document.createElement('style');
              styleTag.id = styleId;
              document.head.appendChild(styleTag);
            }
            
            styleTag.textContent = `
              :root {
                --primary-color: ${settings.primaryColor};
              }
              .text-purple-600, .text-purple-500, .text-purple-400 {
                color: ${settings.primaryColor} !important;
              }
              .bg-purple-600, .bg-purple-500, .bg-purple-100 {
                background-color: ${settings.primaryColor} !important;
              }
              .border-purple-600, .border-purple-500 {
                border-color: ${settings.primaryColor} !important;
              }
              .from-purple-600, .from-purple-900 {
                --tw-gradient-from: ${settings.primaryColor} !important;
              }
              .to-purple-900 {
                --tw-gradient-to: ${settings.primaryColor} !important;
              }
            `;
          }

          // Apply Title & Description (Client-side only)
          if (settings.seoTitle) {
            document.title = settings.seoTitle;
          }
          if (settings.seoDescription) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
              metaDesc.setAttribute('content', settings.seoDescription);
            }
          }
        }
      } catch (error) {
        console.error('Failed to apply theme:', error);
      }
    };

    applyTheme();
  }, [site]);

  return null; // This component handles side effects only
}

'use client';

import { useEffect } from 'react';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc } from 'firebase/firestore';
import type { SiteSettings } from '@/lib/types';

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '139, 92, 246'; // default purple
}

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
                --accent: ${settings.primaryColor};
                --accent-rgb: ${hexToRgb(settings.primaryColor)};
              }
              /* Overrides for common purple classes */
              .text-purple-600, .text-purple-500, .text-purple-400 { color: var(--accent) !important; }
              .bg-purple-600, .bg-purple-500 { background-color: var(--accent) !important; }
              .border-purple-600, .border-purple-500 { border-color: var(--accent) !important; }
              .ring-purple-500 { --tw-ring-color: var(--accent) !important; }
              
              /* Block Specific Overrides */
              .prose-purple { --tw-prose-links: var(--accent); --tw-prose-bullets: var(--accent); }
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

  return null;
}

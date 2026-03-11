import type { Theme } from '@/types';

export interface ThemeMeta {
  id: Theme;
  labelUz: string;
  labelRu: string;
  color: string;     // swatch color for UI
  bg: string;        // preview background
}

export const THEMES: ThemeMeta[] = [
  {
    id: 'red',
    labelUz: 'Qizil',
    labelRu: 'Красная',
    color: '#dc2626',
    bg: '#ffffff',
  },
  {
    id: 'green',
    labelUz: 'Yashil',
    labelRu: 'Зелёная',
    color: '#16a34a',
    bg: '#f0fdf4',
  },
  {
    id: 'yellow',
    labelUz: 'Sariq',
    labelRu: 'Жёлтая',
    color: '#d97706',
    bg: '#fffbeb',
  },
  {
    id: 'dark',
    labelUz: "Qorong'u",
    labelRu: 'Тёмная',
    color: '#ef4444',
    bg: '#0f0f0f',
  },
];

export const DEFAULT_THEME: Theme = 'red';
export const THEME_STORAGE_KEY = 'ar-market-theme';

// Inline script string for no-FOUC theme initialization
// Runs before paint to apply saved theme from localStorage
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');var valid=['red','green','yellow','dark'];if(t&&valid.includes(t)){document.documentElement.setAttribute('data-theme',t);}else{document.documentElement.setAttribute('data-theme','${DEFAULT_THEME}');}}catch(e){}})();`;

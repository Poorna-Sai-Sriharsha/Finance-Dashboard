'use client';

import { useEffect } from 'react';
import { useStore } from '@/store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useStore((s) => s.darkMode);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return <>{children}</>;
}

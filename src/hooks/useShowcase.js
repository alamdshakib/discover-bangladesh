import { useContext } from 'react';
import { ShowcaseContext } from '@/context/showcaseContext.js';

export function useShowcase() {
  const value = useContext(ShowcaseContext);
  if (!value) throw new Error('useShowcase must be used inside <ShowcaseProvider>');
  return value;
}

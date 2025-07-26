
import { useEffect, useRef } from 'react';

export function useInfiniteScroll(callback: () => void) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) callback();
        });
      },
      { threshold: 1 }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [callback]);

  return sentinelRef;
}

import useResizeObserver from '@react-hook/resize-observer';
import { useState, useLayoutEffect, RefObject } from 'react';

const useSizeObserver = (target: RefObject<HTMLElement>) => {
  const [size, setSize] = useState<DOMRect | null>(null);
  useResizeObserver(target, (entry) => setSize(entry.contentRect));

  useLayoutEffect(() => {
    if (target && target.current) {
      setSize(target.current.getBoundingClientRect());
    }
  }, [target]);

  return size;
};

export default useSizeObserver;

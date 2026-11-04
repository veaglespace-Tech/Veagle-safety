'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { api } from '../../utils/api.js';

export function VisitorRenderTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Increment counter by +2 for every render / route visit
    api.post('/stats/visitor-render', {}).catch(() => {});
  }, [pathname]);

  return null;
}

export function VisitorCounterBadge({ className = '' }) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await api.get('/stats/visitor-render');
        if (res.data?.success && typeof res.data?.count === 'number') {
          setCount(res.data.count);
        }
      } catch (e) {}
    };

    fetchCount();
    const interval = setInterval(fetchCount, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  if (count === null || count === undefined) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#FFF0F3] to-[#FFE6EE] border border-[#FFCCE1] text-[#FF2A6D] text-[10px] sm:text-[11px] font-black tracking-wide shadow-xs ${className}`}
      title="Total Website Views & Renders (+2 per visit/render)"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse shrink-0" />
      <span className="text-[#684E67] font-bold">Views:</span>
      <span className="font-mono font-black text-[#FF2A6D]">{count.toLocaleString()}</span>
    </div>
  );
}

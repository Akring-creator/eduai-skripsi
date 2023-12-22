// File ini bertujuan untuk mengubah react quill menjadi Client Side tidak Server Side

'use client';

import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill/dist/quill.bubble.css';

interface PreviewProps {
  value: string;
  oneline: boolean;
}

export const Preview = ({ value, oneline = false }: PreviewProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill'), { ssr: false }),
    []
  );

  return (
    <div className="bg-white">
      <ReactQuill
        theme="bubble"
        value={value}
        readOnly
        className={cn('h-full', oneline && 'h-[39px]')}
      />
    </div>
  );
};

'use client';

import dynamic from 'next/dynamic';
import { useMemo, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export const Editor = ({ onChange, value }: EditorProps) => {
  const handleChange = (content: string) => {
    onChange(content);
  };
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['image', 'video'],
        ['clean'],
      ],
    }),
    []
  );

  const formats = useMemo(
    () => [
      'header',
      'font',
      'size',
      'bold',
      'italic',
      'underline',
      'strike',
      'blockquote',
      'list',
      'bullet',
      'indent',
      'link',
      'image',
      'video',
    ],
    []
  );

  return (
    <div className="bg-white">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

'use client';
import { Button } from '@/components/ui/button';
import { Quiz, Option } from '@prisma/client';
import {
  PlusIcon,
  HardDriveUpload,
  MoreHorizontal,
  PenSquare,
  Pencil,
  Settings,
  Plus,
  ArrowRightToLine,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useRouter } from 'next/navigation';
import ExportToWordHandler from './export-button';
import { auth } from '@clerk/nextjs';
import Link from 'next/link';
import { useState } from 'react';

// Cant use Question Format from prisma

interface Question {
  id: string;
  question: string;
  questionType: string;
  imageUrl: string | null;
  answer: string;
  explanation: string;
  options: Option[]; // Tambahkan properti options dengan tipe Option[]
  quizId: string;
  position: number;
  createdAt: Date;
  updateAt: Date;
}
interface MetadataProps {
  initialData: Quiz & { questions: Question[] };
}

export const Metadata = ({ initialData }: MetadataProps) => {
  const router = useRouter();
  const onClickSettings = () => {
    router.push(`/teacher/quiz/${initialData.id}/settings`);
  };
  return (
    <>
      <div className="relative">
        <div className="bg-slate-100 border p-4 mb-2 rounded flex items-center justify-between">
          <div className="flex items-start">
            <img
              src={
                initialData.imageUrl
                  ? initialData.imageUrl
                  : 'https://uploadthing.com/f/d02b1c91-dd8b-4caf-a629-199f39f3662f-9lxp8g.png'
              }
              alt="Gambar"
              className="w-40 h-40 rounded mr-4"
            />
            <div className="bg-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold mb-2">
                  {initialData.title}
                </h2>
              </div>
              <p className="text-gray-700 text-sm">
                {initialData.description
                  ? initialData.description
                  : 'Tidak Ada Deskripsi'}
              </p>

              <span className="text-sm text-slate-700">
                Terakhir diubah:{' '}
                {initialData.updateAt.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
          {/* Bagian 2 */}
          <div className="absolute top-0 right-0 flex items-start gap-x-3 mt-2 mr-2">
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Plus className="h-5 w-5 p-0 hover:cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href={`/teacher/quiz/${initialData.id}/generate`}>
                    <DropdownMenuItem>
                      <Pencil className="h-5 w-5 mr-2" />
                      Buat Soal
                    </DropdownMenuItem>
                  </Link>
                  <Link href={`/teacher/quiz/${initialData.id}/export`}>
                    <DropdownMenuItem>
                      <ArrowRightToLine className="h-5 w-5 mr-2" />
                      Ekspor Kuis
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Settings
              name="settings"
              className=" w-5 h-5 hover:opacity-75 cursor-pointer "
              onClick={onClickSettings}
            />
          </div>
        </div>
      </div>
    </>
  );
};

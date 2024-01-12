'use client';
import { z } from 'zod';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Option, Question, Quiz } from '@prisma/client';
import {
  Badge,
  BadgeCheckIcon,
  Bot,
  GripVertical,
  Pencil,
  Settings,
  Trash,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BasicQuestionManualForm } from '@/components/questions/manual/basic';

interface MetadataProps {
  initialData: Quiz & { questions: (Question & { options: Option[] })[] };
}

export const Metadata = ({ initialData }: MetadataProps) => {
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
              <Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <GripVertical className="h-5 w-5 p-0 hover:cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        Tambah Soal
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DialogTrigger>
                          <DropdownMenuItem>
                            <Pencil className="h-5 w-5 mr-2" />
                            Manual
                          </DropdownMenuItem>
                        </DialogTrigger>

                        <Link href={`/teacher/quiz/${initialData.id}/generate`}>
                          <DropdownMenuItem>
                            <Bot className="h-5 w-5 mr-2" />
                            Dengan AI
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator></DropdownMenuSeparator>
                    <DropdownMenuItem>
                      <Link href={`/teacher/quiz/${initialData.id}/settings`}>
                        <DropdownMenuItem>
                          <Settings className="h-5 w-5 mr-2" />
                          Pengaturan
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuItem>

                    {/* <Link href={`/teacher/quiz/${initialData.id}/export`}>
                    <DropdownMenuItem>
                      <ArrowRightToLine className="h-5 w-5 mr-2" />
                      Ekspor Kuis
                    </DropdownMenuItem>
                  </Link> */}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogPortal>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Tambah Soal Manual</DialogTitle>
                    </DialogHeader>

                    <BasicQuestionManualForm quizId={initialData.id} />
                  </DialogContent>
                </DialogPortal>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

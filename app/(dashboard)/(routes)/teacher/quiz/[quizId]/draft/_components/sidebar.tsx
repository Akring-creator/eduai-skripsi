'use client';
import { Button } from '@/components/ui/button';
import { Quiz, Option } from '@prisma/client';
import {
  ArrowRightToLine,
  HardDriveUpload,
  PenSquare,
  Pencil,
  Settings,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ExportToWordHandler from './export-button';
import { auth } from '@clerk/nextjs';

// Cant use Question Format from prisma
interface Question {
  id: string;
  question: string;
  imageUrl: string | null;
  answer: string;
  explanation: string;
  options: Option[]; // Tambahkan properti options dengan tipe Option[]
  quizId: string;
  position: number;
  createdAt: Date;
  updateAt: Date;
}
interface SidebarProps {
  initialData: Quiz & { questions: Question[] };
  quizId: string;
}

export const Sidebar = ({ initialData, quizId }: SidebarProps) => {
  const router = useRouter();
  const onClickGenerate = () => {
    router.push(`/teacher/quiz/${initialData.id}/generate`);
  };
  const onClickExport = () => {
    // Jalankan fungsi pembuatan file Word
  };
  const onClickSettings = () => {
    router.push(`/teacher/quiz/${initialData.id}/settings`);
  };
  return (
    <>
      <div className="bg-slate-100 border p-4 rounded">
        {/* Wadah untuk gambar */}
        <div className="mb-4">
          <img
            src={
              initialData.imageUrl
                ? initialData.imageUrl
                : 'https://uploadthing.com/f/d02b1c91-dd8b-4caf-a629-199f39f3662f-9lxp8g.png'
            }
            alt="Gambar"
            className="w-full h-auto rounded"
          />
        </div>
        {/* Tempat judul */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold mb-2">{initialData.title}</h2>
          <Settings
            name="settings"
            className=" w-5 h-5 mr-2 text-slate-700 hover:opacity-75 cursor-pointer "
            onClick={onClickSettings}
          />
        </div>

        <p className="text-gray-700">
          {initialData.description
            ? initialData.description
            : 'Tidak Ada Deskripsi'}
        </p>

        <span className="text-sm text-slate-700">
          Terakhir diubah: {initialData.updateAt.toDateString()}
        </span>
      </div>
      {/* Tombol Bertuliskan Buat Soal */}
      <br></br>
      <div className="px-4 py-2 rounded flex items-center justify-center space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClickGenerate}
          className="hover:opacity-75"
        >
          <Pencil className=" w-4 h-4 mr-2" />
          Buat Soal
        </Button>
        <ExportToWordHandler initialData={initialData} />
      </div>
    </>
  );
};

export default Sidebar;

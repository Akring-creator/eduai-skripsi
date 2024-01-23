'use client';
import axios from 'axios';
import UploadButton from './upload-button';
import { File } from '@prisma/client';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Ghost, Loader2, MessageSquare, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { format } from 'date-fns';

interface DashboardProps {
  files: File[];
}
const Dashboard = ({ files }: DashboardProps) => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);
  const router = useRouter();
  const onDelete = async (fileId: string) => {
    console.log('Masuk Kesini');
    try {
      // Menampilkan loader atau memberikan feedback bahwa proses penghapusan sedang berlangsung
      setCurrentlyDeletingFile(fileId);

      // Melakukan penghapusan melalui API
      const response = await axios.delete(`/api/library/${fileId}`);

      // Menghentikan loader setelah penghapusan selesai
      setCurrentlyDeletingFile(null);

      // Menangani respons dari API
      if (response.status === 200) {
        // File berhasil dihapus, lakukan pembaruan state atau tindakan lain yang diperlukan
        console.log('File deleted successfully');
      } else {
        // Menangani kasus lain seperti file tidak ditemukan atau kesalahan server
        console.error('Failed to delete file:', response.data);
      }
    } catch (error) {
      // Menangani kesalahan selama proses penghapusan
      console.error('Error deleting file:', error);
      setCurrentlyDeletingFile(null); // Pastikan loader dihentikan dalam kasus kesalahan
    }
    router.refresh();
  };
  return (
    <div className="p-8">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-3xl text-gray-900">Pustaka</h1>
        <UploadButton />
      </div>
      {files && files?.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
              >
                <Link
                  href={`/teacher/library/${file.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-lg font-medium text-zinc-900">
                          {file.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {format(new Date(file.createdAt), 'MMM yyyy')}
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    mocked
                  </div>

                  <Button
                    onClick={() => onDelete(file.id)}
                    size="sm"
                    className="w-full"
                    variant="destructive"
                  >
                    {currentlyDeletingFile === file.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let&apos;s upload your first PDF.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

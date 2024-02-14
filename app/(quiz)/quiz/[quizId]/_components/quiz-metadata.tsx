'use client';
import { Button } from '@/components/ui/button';
import { Option, Question, Quiz } from '@prisma/client';
import axios from 'axios';
import { toast } from 'sonner';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface MetadataProps {
  initialData: Quiz & { questions: (Question & { options: Option[] })[] };
}

export const Metadata = ({ initialData }: MetadataProps) => {
  const [createGames, setCreateGames] = useState<boolean>(false);
  const router = useRouter();
  const onSubmit = async () => {
    try {
      setCreateGames(true);
      const games = await axios.post('/api/games', { quizId: initialData.id });
      const gamePublicId = games.data.publicId;
      router.push(`/games/${gamePublicId}`);
    } catch (error) {
      console.error(error);
      toast('Event has been created', {
        description: 'Sunday, December 03, 2023 at 9:00 AM',
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      });
    }
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

          <Button onClick={onSubmit} variant="outline">
            Mainkan
          </Button>

          {/* Bagian 2 */}
        </div>
      </div>
    </>
  );
};

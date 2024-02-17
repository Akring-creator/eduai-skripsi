// Jangan Lupa buat komponen umumnya kalau navcar utama saudah dibaiki

import Image from 'next/image';
import { Question, Quiz, Option, Game } from '@prisma/client';
import Link from 'next/link';
import { differenceInSeconds } from 'date-fns';

import Timer from './timer';

interface GameNavbarProps {
  initialData: Game & { quiz: Quiz };
}

export const GameNavbar = ({ initialData }: GameNavbarProps) => {
  const timeInSeconds = differenceInSeconds(initialData.timeEnded!, new Date());
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <div className="flex items-center justify-between w-full">
        <Link href={'/'}>
          <div className="bg-white rounded-full p-1 mr-4">
            <Image src="/logo.svg" alt="Edtek" height="70" width="70" />
          </div>
        </Link>

        <div className="flex-grow text-lg font-semibold">
          {initialData.title}
        </div>

        <div className="">
          <Timer initialTime={timeInSeconds} />
        </div>
      </div>
    </div>
  );
};

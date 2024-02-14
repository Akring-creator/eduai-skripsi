import { NavbarRoutes } from '@/components/navbar-routes';
import Image from 'next/image';
import { Question, Quiz, Option } from '@prisma/client';
import Link from 'next/link';

interface QuizNavbarProps {
  initialData: Quiz & { questions: (Question & { options: Option[] })[] };
}

export const QuizNavbar = ({ initialData }: QuizNavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <Link href={'/'}>
        <div className="bg-white rounded-full p-1 mr-4">
          <Image src="/logo.svg" alt="Edtek" height="70" width="70" />
        </div>
      </Link>

      <div className="flex-grow">{initialData.title}</div>
      <NavbarRoutes />
    </div>
  );
};

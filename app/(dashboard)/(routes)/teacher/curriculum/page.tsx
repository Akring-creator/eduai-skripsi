import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const CurriculumPage = () => {
  return (
    <div className="p-6">
      <div className="relative  h-[100px] w-[100px]">
        <Link href={'/teacher/curriculum/modul-ajar'}>
          <Image layout="fill" alt="logo" src="/modul-ajar.svg" />
        </Link>
      </div>

      <p className="mt-4 font-semibold text-sm text-sky-700">Modul Ajar</p>
    </div>
  );
};

export default CurriculumPage;

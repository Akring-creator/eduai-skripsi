import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CurriculumPage = () => {
  return (
    <div>
      <Link href={'/teacher/curriculum/modul-ajar'}>
        <Button>Modul Ajar</Button>
      </Link>
    </div>
  );
};

export default CurriculumPage;

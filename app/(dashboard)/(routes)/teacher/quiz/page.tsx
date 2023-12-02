import { Button } from '@/components/ui/button';
import Link from 'next/link';

const listofItem = ['item'];

const QuizPage = () => {
  return (
    <div className="flex items-center gap-x-2 ml-2 mt-2">
      <Link href="/teacher/create-quiz">
        <Button type="button" variant="default">
          Kuis Baru
        </Button>
      </Link>
    </div>
  );
};

export default QuizPage;

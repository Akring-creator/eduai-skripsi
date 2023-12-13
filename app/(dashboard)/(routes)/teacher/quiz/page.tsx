import { Button } from '@/components/ui/button';
import Link from 'next/link';

const listofItem = ['item'];

const QuizPage = () => {
  return (
    <div className="p-6">
      <Link href="/teacher/create-quiz">
        <Button type="button" variant="default">
          Kuis Baru
        </Button>
      </Link>
    </div>
  );
};

export default QuizPage;

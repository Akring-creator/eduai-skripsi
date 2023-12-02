import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { QuizCard } from './_components/generate-card';

const Generate = ({ params }: { params: { quizId: string } }) => {
  return (
    <div>
      <QuizCard quizId={params.quizId} />
    </div>
  );
};

export default Generate;

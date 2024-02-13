import { Menu } from 'lucide-react';
import { Question, Quiz, Option } from '@prisma/client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { QuizSidebar } from './quiz-sidebar';

interface QuizMobileSidebarProps {
  initialData: Quiz & { questions: (Question & { options: Option[] })[] };
}

export const QuizMobileSidebar = ({ initialData }: QuizMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-72">
        <QuizSidebar initialData={initialData} />
      </SheetContent>
    </Sheet>
  );
};

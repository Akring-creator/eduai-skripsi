import { NavbarRoutes } from '@/components/navbar-routes';

import { CourseMobileSidebar } from './quiz-mobile-sidebar';
import { Question, Quiz, Option } from '@prisma/client';

interface QuizNavbarProps {
  initialData: Quiz & { questions: (Question & { options: Option[] })[] };
}

export const CourseNavbar = ({ initialData }: QuizNavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  );
};

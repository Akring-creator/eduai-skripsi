import { auth } from '@clerk/nextjs';
import { Chapter, Course, UserProgress } from '@prisma/client';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { CourseProgress } from '@/components/course-progress';

import { CourseSidebarItem } from './quiz-sidebar-item';
import { Question, Quiz, Option } from '@prisma/client';

interface QuizSidebarProps {
  initialData: Quiz & { questions: (Question & { options: Option[] })[] };
}

export const QuizSidebar = async ({ initialData }: QuizSidebarProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{initialData.title}</h1>
      </div>
      <div className="flex flex-col w-full">
        {initialData.questions.map((question) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
};

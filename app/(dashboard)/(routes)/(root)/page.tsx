import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { SearchInput } from '@/components/search-input';
import { getCourses } from '@/actions/get-courses';
import { CoursesList } from '@/components/courses-list';

import { Categories } from './_components/categories';
import { getQuizzes } from '@/actions/get-quizzes';
import { QuizList } from '@/components/quiz-list';

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const categories = [
    {
      id: 'all',
      name: 'Semua',
    },
    {
      id: 'quiz',
      name: 'Kuis',
    },
    {
      id: 'course',
      name: 'Kursus',
    },
    {
      id: 'curriculum',
      name: 'Kurikulum',
    },
  ];

  const dataType = searchParams.categoryId;

  const quizzes = await getQuizzes({
    userId,
    title: searchParams.title,
  });
  const courses = await getCourses({
    userId,
    title: searchParams.title,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        {dataType === 'course' ? (
          <CoursesList items={courses} />
        ) : dataType === 'quiz' ? (
          <QuizList items={quizzes} />
        ) : (
          <div className="space-y-2">
            <CoursesList items={courses} />
            <QuizList items={quizzes} />
          </div>
        )}
      </div>
    </>
  );
};

export default SearchPage;

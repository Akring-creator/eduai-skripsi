'use client';
import { auth } from '@clerk/nextjs';
import { redirect, useSearchParams } from 'next/navigation';

import { db } from '@/lib/db';
import { SearchInput } from '@/components/search-input';
import { getCourses } from '@/actions/get-courses';
import { CoursesList } from '@/components/courses-list';

import { Categories } from './_components/categories';
import { useState } from 'react';

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const [searchType, setSearchType] = useState('Kursus');

  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput onChangeSearchType={(value) => setSearchType(value)} />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        {searchType === 'Kursus' ? <CoursesList items={courses} /> : null}
      </div>
    </>
  );
};

export default SearchPage;

'use client';

import {
  BarChart,
  Compass,
  Layout,
  List,
  FormInput,
  Workflow,
  LibraryBig,
  Waypoints,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import { SidebarItem } from './sidebar-item';

const guestRoutes = [
  {
    icon: Layout,
    label: 'Dashboard',
    href: '/',
  },
  {
    icon: Compass,
    label: 'Jelajahi',
    href: '/search',
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: 'Kursus',
    href: '/teacher/courses',
  },
  {
    icon: FormInput,
    label: 'Kuis',
    href: '/teacher/quiz',
  },
  {
    icon: LibraryBig,
    label: 'Kurikulum',
    href: '/teacher/curriculum',
  },
  {
    icon: Waypoints,
    label: 'Belajar Mandiri',
    href: '/teacher/connections',
  },
  {
    icon: BarChart,
    label: 'Analisis',
    href: '/teacher/analytics',
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes('/teacher');

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

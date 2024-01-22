'use client';

import {
  BarChart,
  Compass,
  Shapes,
  List,
  FormInput,
  Workflow,
  LibraryBig,
  Waypoints,
  GraduationCap,
  LucideIcon,
} from 'lucide-react';

import { IconType } from 'react-icons';
import { CategoryItem } from './category-item';
interface Category {
  id: string;
  name: string;
}
interface CategoriesProps {
  items: Category[];
}
const iconMap: Record<Category['name'], LucideIcon> = {
  Kursus: List,
  Kuis: FormInput,
  Kurikulum: GraduationCap,
  Semua: Shapes,
};
export const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2 ">
      {/* <div className="scrollbar-h-2 scrollbar scrollbar-thumb-rounded-fullscrollbar-track-rounded-full scrollbar-thumb-slate-500 scrollbar-track-slate-100 hover:scrollbar-thumb-sky-700 "> */}
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
      {/* </div> */}
    </div>
  );
};

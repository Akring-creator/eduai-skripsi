'use client';

import { Category } from '@prisma/client';
import {
  FcAreaChart, //
  FcBiotech, // Biologi
  FcBarChart, // Matematika
  FcConferenceCall, //Sosiologi
  FcLibrary, //
  FcMindMap, // Kimia
  FcGlobe, // Geografi
  FcFlashOn, // Fisika
  FcIdea, // Seni
  FcFaq, // Bahasa
  FcEnteringHeavenAlive, // Agama
  FcButtingIn, // Olahraga
} from 'react-icons/fc';

import { IconType } from 'react-icons';
import { CategoryItem } from './category-item';
interface CategoriesProps {
  items: Category[];
}
const iconMap: Record<Category['name'], IconType> = {
  Kewarganegaraan: FcLibrary,
  Ekonomi: FcAreaChart,
  Biologi: FcBiotech,
  Matematika: FcBarChart,
  Geografi: FcGlobe,
  Fisika: FcFlashOn,
  Bahasa: FcFaq,
  Agama: FcEnteringHeavenAlive,
  Olahraga: FcButtingIn,
  Seni: FcIdea,
  Kimia: FcMindMap,
  Sosiologi: FcConferenceCall,
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

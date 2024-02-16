import { cn } from '@/lib/utils';
import { Badge, BadgeCheck, BadgeCheckIcon, Key, KeyRound } from 'lucide-react';
import axios from 'axios';
import { ElementRef, useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Option } from '@prisma/client';

interface OptionFormProps {
  option: Option;
}
const OptionForm = ({ option }: OptionFormProps) => {
  return (
    <div className="flex items-center justify-between w-90 ">
      <div className="mt-2 mr-6 p-3 ml-2 font-medium border border-slate-200 w-full transition duration-300 ease-in-out transform hover:scale-105">
        <div>
          <p className="text-gray-700">{option.option}</p>
        </div>
      </div>
      <div
        className={cn(
          'ml-2 h-6 w-6 text-slate-500 hover:cursor-pointer',
          option.isKeyAnswer && 'text-sky-700'
        )}
      >
        {option.isKeyAnswer ? <BadgeCheckIcon /> : <Badge />}
      </div>
    </div>
  );
};

export default OptionForm;

import { cn } from '@/lib/utils';
import { Badge, BadgeCheck, BadgeCheckIcon, Key, KeyRound } from 'lucide-react';
import axios from 'axios';
import { ElementRef, useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Option } from '@prisma/client';
import { Button } from '@/components/ui/button';

interface OptionFormProps {
  onSelectedOption: (optionId: string) => void;
  option: Pick<Option, 'id' | 'option'>;
  isSelected: boolean;
}
const OptionForm = ({
  onSelectedOption,
  option,
  isSelected,
}: OptionFormProps) => {
  return (
    <div className="p-1 flex items-center justify-between">
      <Button
        className="w-full"
        variant={isSelected ? 'default' : 'outline'}
        onClick={() => onSelectedOption(option.id)}
      >
        {option.option}
      </Button>
    </div>
  );
};

export default OptionForm;

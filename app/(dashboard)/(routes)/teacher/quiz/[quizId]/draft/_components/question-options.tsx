import { cn } from '@/lib/utils';
import { Badge, BadgeCheck, BadgeCheckIcon, Key, KeyRound } from 'lucide-react';
import axios from 'axios';
import { ElementRef, useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Option } from '@prisma/client';

interface OptionFormProps {
  quizId: string;
  questionId: string;
  option: Option;
  keyAnswerId: string;
  onKeyUpdate: (value: string) => void;
  onOptionChange: (id: string, value: string) => void;
  onDelete: (value: string) => void;
}

const OptionForm = ({
  quizId,
  questionId,
  option,
  keyAnswerId,
  onDelete,
  onKeyUpdate,
  onOptionChange,
}: OptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<ElementRef<'textarea'>>(null);
  const [value, setValue] = useState(option);
  const [show, setShow] = useState(true);

  const enableInput = async () => {
    setIsEditing(true);

    setTimeout(async () => {
      inputRef.current?.focus();
      setValue(option);
    }, 0);
  };

  const disableInput = async () => {
    setIsEditing(false);
    if (value.option.length === 0) {
      setShow(false);
      onDelete(value.id);
    } else {
      onOptionChange(option.id, value.option);
    }
  };

  const onInput = (newOption: string) => {
    setValue({
      ...value,
      option: newOption,
    });
  };

  const onClickKeyAnswer = async () => {
    if (option.id !== keyAnswerId) {
      onKeyUpdate(option.id);
    }
  };

  return (
    show && (
      <div key={option.id} className="flex items-center justify-between w-90">
        <div
          className={cn(
            'mt-2 mr-6 p-3 ml-2 font-medium border border-slate-200 w-full transition duration-300 ease-in-out transform hover:scale-105',
            isEditing ? 'border-sky-700' : 'hover:border-gray-400'
          )}
        >
          <div>
            {!isEditing ? (
              <div onClick={enableInput} className="cursor-pointer">
                <p className="text-gray-700">{value.option}</p>
              </div>
            ) : (
              <TextareaAutosize
                className="bg-transparent outline-none break-words w-full text-gray-800"
                ref={inputRef}
                value={value.option}
                onBlur={disableInput}
                onChange={(e) => onInput(e.target.value)}
              />
            )}
          </div>
        </div>
        <div
          className={cn(
            'ml-2 h-6 w-6 text-slate-500 hover:cursor-pointer',
            option.id === keyAnswerId && 'text-sky-700'
          )}
          onClick={onClickKeyAnswer}
        >
          {option.id === keyAnswerId ? <BadgeCheckIcon /> : <Badge />}
        </div>
      </div>
    )
  );
};

export default OptionForm;

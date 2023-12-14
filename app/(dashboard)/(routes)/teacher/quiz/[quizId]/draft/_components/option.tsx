import { cn } from '@/lib/utils';
import { Badge, BadgeCheck, BadgeCheckIcon, Key, KeyRound } from 'lucide-react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { ElementRef, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

interface OptionFormProps {
  isKeyAnswer: Boolean;
  quizId: string;
  questionId: string;
  optionValue: string;
  optionId: string;
}
const OptionForm = ({
  quizId,
  questionId,
  optionValue,
  optionId,
  isKeyAnswer,
}: OptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<ElementRef<'textarea'>>(null);
  const [value, setValue] = useState(optionValue);
  const searchParams = useSearchParams();
  const currentOptionId = searchParams.get('optionId');
  console.log(currentOptionId);

  const enableInput = async () => {
    setIsEditing(true);
    const response = await axios.get(
      `/api/quiz/${quizId}/questions/${questionId}/option/${optionId}`
    );

    setTimeout(() => {
      // console.log(response.data.option);
      setValue(response.data.option);
      inputRef.current?.focus();
    }, 0);
  };
  const disableInput = async () => {
    setIsEditing(false);
    console.log(value);
    const update = await axios.patch(
      `/api/quiz/${quizId}/questions/${questionId}/option/${optionId}`,
      {
        option: value,
      }
    );
  };
  const onInput = (newoption: string) => {
    setValue(newoption);

    // Hasil console.log(value)
  };
  return (
    <div className="flex items-center justify-between w-90 ">
      <div
        className={cn(
          'mt-2 mr-4 p-3 ml-2 font-medium border border-slate-200 w-full transition duration-300 ease-in-out transform hover:scale-105',
          isEditing ? 'border-sky-700' : 'hover:border-gray-400'
        )}
      >
        <div>
          {!isEditing ? (
            <div onClick={enableInput} className="cursor-pointer">
              <p className="text-gray-700">{value}</p>
            </div>
          ) : (
            <TextareaAutosize
              className="bg-transparent outline-none break-words w-full text-gray-800"
              ref={inputRef}
              value={value}
              onBlur={disableInput}
              onChange={(e) => onInput(e.target.value)}
            />
          )}
        </div>
      </div>
      <div
        className={cn(
          'ml-2 h-6 w-6 text-slate-500 hover:cursor-pointer',
          isKeyAnswer && 'text-sky-700'
        )}
      >
        {isKeyAnswer ? <BadgeCheckIcon /> : <Badge />}
      </div>
    </div>
  );
};

export default OptionForm;

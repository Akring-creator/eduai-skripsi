import { cn } from '@/lib/utils';
import { Badge, BadgeCheck, BadgeCheckIcon, Key, KeyRound } from 'lucide-react';
import axios from 'axios';
import { ElementRef, useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

interface OptionFormProps {
  quizId: string;
  questionId: string;
  optionId: string;
  keyAnswerId: string;
  onKeyUpdate: (value: string) => void;
}
const OptionForm = ({
  quizId,
  questionId,
  optionId,
  keyAnswerId,
  onKeyUpdate,
}: OptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<ElementRef<'textarea'>>(null);
  const [value, setValue] = useState('');
  const getOption = async () => {
    try {
      const response = await axios.get(
        `/api/quiz/${quizId}/questions/${questionId}/option/${optionId}`
      );
      const option = response.data.option; // Mengambil data dari respons API
      setValue(option); // Mengatur nilai state dengan hasil panggilan API
    } catch (error) {
      // Tangani error jika terjadi
      console.error('Error fetching option:', error);
    }
  };

  useEffect(() => {
    getOption(); // Panggil fungsi getOption saat komponen dimuat
  }, []);

  const enableInput = async () => {
    setIsEditing(true);

    setTimeout(async () => {
      inputRef.current?.focus();
      // console.log(response.data.option);
      const response = await axios.get(
        `/api/quiz/${quizId}/questions/${questionId}/option/${optionId}`
      );
      setValue(response.data.option);
    }, 0);
  };
  const disableInput = async () => {
    setIsEditing(false);
    await axios.patch(
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

  const onClickKeyAnswer = async () => {
    if (optionId !== keyAnswerId) {
      await axios.patch(
        `/api/quiz/${quizId}/questions/${questionId}/option/${optionId}/keyanswer`,
        {
          isKeyAnswer: true,
        }
      );
      onKeyUpdate(optionId);
    } // Mengubah nilai isKeyAnswer menjadi kebalikannya
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
          optionId === keyAnswerId && 'text-sky-700'
        )}
        onClick={onClickKeyAnswer}
      >
        {optionId === keyAnswerId ? <BadgeCheckIcon /> : <Badge />}
      </div>
    </div>
  );
};

export default OptionForm;

import axios from 'axios';
import TextareaAutosize from 'react-textarea-autosize';
import { ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import { Option, Question } from '@prisma/client';
import { ElementRef, useEffect, useRef, useState } from 'react';
import OptionForm from './question-options';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { ShortAnswer } from './short-answer';
import { db } from '@/lib/db';

interface QuestionCardProps {
  initialData: Question & { options: Option[] };
  quizId: string;
  qType: string;
}

const QuestionCard = ({ initialData, quizId, qType }: QuestionCardProps) => {
  // Menginisialisasi State
  const [options, setOptions] = useState(initialData.options);
  const correctAnswer = options.find((option) => option.isKeyAnswer === true);
  const [keyAnswerId, setKeyAnswerId] = useState(correctAnswer?.id);
  const [showAllQuestionSection, setShowAllQuestionSection] = useState(false);
  const [deletedOption, setDeletedOption] = useState<string[]>([]);
  const [editing, setIsEditing] = useState({
    question: false,
    explanation: false,
  });
  const [value, setValue] = useState({
    question: initialData.question,
    explanation: initialData.explanation,
  });

  // Menggunakan UseRef untuk Pertanyaan dan Jawaban
  const inputQuestionRef = useRef<ElementRef<'textarea'>>(null);
  const inputExplanationRef = useRef<ElementRef<'textarea'>>(null);

  // Mengubah nilai key Answer pada state options
  const onKeyUpdate = (value: string) => {
    const updatedOptions = options.map((option) => {
      if (option.id === value) {
        return {
          ...option,
          isKeyAnswer: true,
        };
      }
      return {
        ...option,
        isKeyAnswer: false,
      };
    });

    setOptions(updatedOptions);
    setKeyAnswerId(value);
  };

  // mengubah nilai option pada state options
  const onOptionChange = (id: string, value: string) => {
    const updatedOptions = options.map((option) => {
      if (option.id === id) {
        return {
          ...option,
          option: value,
        };
      }
      return {
        ...option,
      };
    });

    setOptions(updatedOptions);
  };

  // Mengupload Nilai Option ke Database jika div sudah tidak lagi menjadi fokus
  const uploadOption = async () => {
    try {
      for (const option of options) {
        console.log('ini deleted' + deletedOption);
        console.log(option.id);
        if (!deletedOption.includes(option.id)) {
          await axios.patch(
            `/api/quiz/${quizId}/questions/${initialData.id}/option/${option.id}`,
            option
          );
        }
      }
    } catch (error) {
      console.error('Error uploading options:', error);
    }
  };

  const onDelete = async (id: string) => {
    console.log(id);
    // setDeletedOption((prevId) => [...prevId, id]);
    // const newOptions = options.filter((option) => option.id !== id);
    // setOptions(newOptions);
    // console.log(newOptions);
    // await axios.delete(
    //   `/api/quiz/${quizId}/questions/${initialData.id}/option/${id}`
    // );
  };

  const enableQuestionInput = async () => {
    setIsEditing({
      ...editing,
      question: true,
    });
    const response = await axios.get(
      `/api/quiz/${quizId}/questions/${initialData.id}`
    );

    setTimeout(() => {
      setValue({
        ...value,
        question: response.data.question,
      });
      inputQuestionRef.current?.focus();
    }, 0);
  };
  const enableExplanationInput = async () => {
    setIsEditing({
      ...editing,
      explanation: true,
    });
    const response = await axios.get(
      `/api/quiz/${quizId}/questions/${initialData.id}`
    );

    setTimeout(() => {
      setValue({
        ...value,
        explanation: response.data.explanation,
      });
      inputExplanationRef.current?.focus();
    }, 0);
  };
  const disableQuestionInput = async () => {
    setIsEditing({
      ...editing,
      question: false,
    });
    await axios.patch(`/api/quiz/${quizId}/questions/${initialData.id}`, {
      question: value.question,
    });
  };

  const disableExplanationInput = async () => {
    setIsEditing({
      ...editing,
      explanation: false,
    });
    await axios.patch(`/api/quiz/${quizId}/questions/${initialData.id}`, {
      explanation: value.explanation,
    });
  };
  const toggleShowAllQuestionSection = () => {
    setShowAllQuestionSection(!showAllQuestionSection);
  };

  const onQuestionInput = async (newQuestion: string) => {
    setValue({
      ...value,
      question: newQuestion,
    });
  };

  const onExplanationInput = async (newExplanation: string) => {
    setValue({
      ...value,
      explanation: newExplanation,
    });
  };

  return (
    <div className="p-2">
      <div className="flex items-center justify-between w-90">
        <div className="text-xl mb-4 w-full">
          {!editing.question ? (
            <div
              onClick={enableQuestionInput}
              className="outline-none font-bold "
            >
              {value.question}
            </div>
          ) : (
            <TextareaAutosize
              className="w-full bg-transparent outline-none font-bold break-words "
              ref={inputQuestionRef}
              value={value.question}
              onBlur={disableQuestionInput}
              onChange={(e) => onQuestionInput(e.target.value)}
            />
          )}
        </div>
        <div
          onClick={toggleShowAllQuestionSection}
          className={cn(
            'w-6 text-slate-500 hover:opacity-70 cursor-pointer',
            showAllQuestionSection && 'text-sky-700'
          )}
        >
          {showAllQuestionSection ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
      <div
        className={`transition-all ${
          showAllQuestionSection
            ? 'max-h-full opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        {qType === 'multipleChoice' ? (
          <div tabIndex={1} onBlur={uploadOption}>
            {options.map((option, index) => (
              <div key={index}>
                <OptionForm
                  onDelete={(id) => onDelete(id)}
                  keyAnswerId={keyAnswerId!}
                  option={option}
                  onKeyUpdate={(value) => onKeyUpdate(value)}
                  onOptionChange={(id, value) => onOptionChange(id, value)}
                  questionId={initialData.id}
                  quizId={quizId}
                />
              </div>
            ))}
          </div>
        ) : qType === 'shortAnswer' ? (
          <div>
            <ShortAnswer
              optionId={keyAnswerId!}
              questionId={initialData.id}
              quizId={quizId}
            />
          </div>
        ) : null}

        <div
          className={cn(
            'p-2 mt-2 text-sm',
            qType === 'longAnswer' && 'text-base'
          )}
        >
          <p className="font-bold">
            {qType === 'longAnswer' ? 'Jawaban:' : 'Pembahasan:'}
          </p>

          <div className="mb-4 w-full">
            {!editing.explanation ? (
              <div onClick={enableExplanationInput} className="outline-none">
                {value.explanation}
              </div>
            ) : (
              <TextareaAutosize
                className="bg-transparent outline-none break-words w-full"
                ref={inputExplanationRef}
                value={value.explanation}
                onBlur={disableExplanationInput}
                onChange={(e) => onExplanationInput(e.target.value)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;

import axios from 'axios';
import TextareaAutosize from 'react-textarea-autosize';
import { ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import { Option } from '@prisma/client';
import { ElementRef, useRef, useState } from 'react';
import OptionForm from './option';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

interface Question {
  id: string;
  question: string;
  imageUrl: string | null;
  answer: string;
  explanation: string;
  options: Option[];
  quizId: string;
  position: number;
  createdAt: Date;
  updateAt: Date;
}
interface QuestionCardProps {
  initialData: Question;
  quizId: string;
}

const QuestionCard = ({ initialData, quizId }: QuestionCardProps) => {
  const questionId = initialData.id;
  const [editing, setIsEditing] = useState({
    question: false,
    explanation: false,
  });
  const [showAllQuestionSection, setShowAllQuestionSection] = useState(false);

  const inputQuestionRef = useRef<ElementRef<'textarea'>>(null);
  const inputExplanationRef = useRef<ElementRef<'textarea'>>(null);
  const [value, setValue] = useState({
    question: initialData.question,
    explanation: initialData.explanation,
  });
  const enableQuestionInput = async () => {
    setIsEditing({
      ...editing,
      question: true,
    });
    const response = await axios.get(
      `/api/quiz/${quizId}/questions/${questionId}`
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
      `/api/quiz/${quizId}/questions/${questionId}`
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
    const update = await axios.patch(
      `/api/quiz/${quizId}/questions/${questionId}`,
      {
        question: value.question,
      }
    );
  };

  const disableExplanationInput = async () => {
    setIsEditing({
      ...editing,
      explanation: false,
    });
    const update = await axios.patch(
      `/api/quiz/${quizId}/questions/${questionId}`,
      {
        explanation: value.explanation,
      }
    );
  };
  const toggleShowAllQuestionSection = () => {
    setShowAllQuestionSection(!showAllQuestionSection);
  };

  const onQuestionInput = async (newQuestion: string) => {
    setValue({
      ...value,
      question: newQuestion,
    });
    // const update = await axios.patch(`/api/question/${initialData.id}`, { question: newquestion })
    // Hasil console.log(value)
  };

  const onExplanationInput = async (newExplanation: string) => {
    setValue({
      ...value,
      explanation: newExplanation,
    });
    // const update = await axios.patch(`/api/question/${initialData.id}`, { question: newquestion })
    // Hasil console.log(value)
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
        {initialData.options.map((option, index) => (
          <div key={index}>
            <OptionForm
              isKeyAnswer={option.isKeyAnswer}
              optionId={option.id}
              optionValue={option.option}
              questionId={questionId}
              quizId={quizId}
            />
          </div>
        ))}
        <div className="p-2 mt-2 font-medium">
          <p className="font-bold">Pembahasan:</p>

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
      {/* )} */}
      {/* Bagian 2 */}
    </div>
  );
};

export default QuestionCard;

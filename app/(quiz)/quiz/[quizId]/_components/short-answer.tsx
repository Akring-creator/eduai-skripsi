import { Option } from '@prisma/client';

interface ShortAnswerProps {
  option: Option;
}
export const ShortAnswer = ({ option }: ShortAnswerProps) => {
  return (
    <div className="flex items-center justify-between w-90 ">
      <div className="mt-2 mr-6 p-3 ml-2 font-medium border border-slate-200 w-full transition duration-300 ease-in-out transform hover:scale-105">
        <div>
          <p className="text-gray-700">{option.option}</p>
        </div>
      </div>
    </div>
  );
};

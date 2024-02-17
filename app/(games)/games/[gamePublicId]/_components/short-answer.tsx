import { Input } from '@/components/ui/input';
import { Option } from '@prisma/client';

interface ShortAnswerProps {
  option: Pick<Option, 'id' | 'option'>;
}
export const ShortAnswer = ({ option }: ShortAnswerProps) => {
  return (
    <div className="flex items-center justify-between w-90 ">
      <div className="mt-2 mr-6 p-3 ml-2 font-medium border border-slate-200 w-full transition duration-300 ease-in-out transform hover:scale-105">
        <div>
          <Input />
        </div>
      </div>
    </div>
  );
};

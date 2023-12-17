'use client';

import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuItem,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import axios from 'axios';
import {
  ArrowUpDown,
  BadgeCheck,
  ChevronRight,
  ListMinus,
  ListPlus,
  MoreHorizontal,
  PenLine,
  Plus,
  Trash,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface QuestionActionsProps {
  quizId: string;
  questionId: string;
}

const QuestionAction = ({ quizId, questionId }: QuestionActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/quiz/${quizId}/questions/${questionId}`);
      toast.success('Soal dihapus');
      router.refresh();
    } catch {
      toast.error('Terdapat Kendala');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className=" flex items-center gap-x-2">
      <Badge className="bg-sky-700">Pilihan Ganda</Badge>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" disabled={isLoading} variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <ListPlus className="h-3 w-3 mr-2" />
              <p className="text-xs">Tambah Option</p>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ArrowUpDown className="h-3 w-3 mr-2" />
                <p className="text-xs">Ganti Tipe</p>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <BadgeCheck className="h-3 w-3 mr-2" />
                    <p className="text-xs">Pilihan Ganda</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <PenLine className="h-3 w-3 mr-2" />
                    <p className="text-xs">Isian Singkat</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ListMinus className="h-3 w-3 mr-2" />
                    <p className="text-xs">Essay</p>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem>
              <Trash className="h-3 w-3 mr-2 text-red-500" onClick={onDelete} />
              <p className="text-red-500 text-xs">Hapus Soal</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
      {/*  */}
    </div>
  );
};

export default QuestionAction;

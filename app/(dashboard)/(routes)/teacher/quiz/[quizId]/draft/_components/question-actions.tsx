'use client';

import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogPortal,
} from '@/components/ui/alert-dialog'; // Pastikan untuk mengimpor komponen-komponen dari pustaka atau framework dialog yang kamu gunakan

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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
import { Option } from '@prisma/client';
interface Question {
  id: string;
  question: string;
  imageUrl: string | null;
  answer: string;
  questionType: string;
  explanation: string;
  options: Option[]; // Tambahkan properti options dengan tipe Option[]
  quizId: string;
  position: number;
  createdAt: Date;
  updateAt: Date;
}
interface QuestionActionsProps {
  quizId: string;
  initialData: Question;
  qType: string; // Tambahkan properti questionType
  onEdit: (value: string) => void;
  onUpdate: (value: boolean) => void;
}

const QuestionAction = ({
  quizId,
  initialData,
  qType,
  onEdit,
  onUpdate,
}: QuestionActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [questionType, setQuestionType] = useState(qType);
  console.log(questionType);

  const onChangeType = async (value: string) => {
    try {
      onUpdate(true);

      await axios.patch(`/api/quiz/${quizId}/questions/${initialData.id}`, {
        questionType: value,
      });
      setQuestionType(value);
      onEdit(value);
    } catch (error) {
      toast.error('Terdapat Kendala');
      router.refresh();
    } finally {
      onUpdate(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/quiz/${quizId}/questions/${initialData.id}`);
      toast.success('Soal dihapus');
      router.refresh();
    } catch {
      toast.error('Terdapat Kendala');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      {qType === 'multipleChoice' ? (
        <Badge className="bg-sky-700">Pilihan Ganda</Badge>
      ) : qType === 'shortAnswer' ? (
        <Badge className="bg-emerald-700">Isian Singkat</Badge>
      ) : qType === 'longAnswer' ? (
        <Badge className="bg-fuchsia-700">Uraian</Badge>
      ) : null}

      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isLoading}>
            <Button size="sm" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
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
              <DropdownMenuSubContent>
                <DropdownMenuLabel className="text-xs">
                  Bentuk Standar
                </DropdownMenuLabel>
                <DropdownMenuSeparator></DropdownMenuSeparator>
                <DropdownMenuRadioGroup
                  value={questionType}
                  onValueChange={(value) => onChangeType(value)}
                >
                  <DropdownMenuRadioItem value="multipleChoice">
                    <p className="text-xs">Pilihan Ganda</p>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="shortAnswer">
                    <p className="text-xs">Isian Singkat</p>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="longAnswer">
                    <p className="text-xs">Uraian</p>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(event) => event.stopPropagation()}>
              <AlertDialogTrigger>
                <DropdownMenuItem>
                  <Trash className="h-3 w-3 mr-2 text-red-500" />
                  <p className="text-red-500 text-xs">Hapus Soal</p>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogPortal>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apakah kamu yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini bersifat permanen
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={(event) => event.stopPropagation()}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </div>
  );
};

export default QuestionAction;

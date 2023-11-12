"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Route } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Question, Quiz } from "@prisma/client";
import { cn } from "@/lib/utils";
import { QuestionsList } from "./questions-list";


interface QuestionFormProps {
    initialData: Quiz & { questions : Question[]};
    quizId : string;
};

export const QuestionForm = (
    {
        initialData,
       quizId
    }: QuestionFormProps
) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();
    
    const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      
      setIsUpdating(true);

      await axios.put(`/api/quiz/${quizId}/questions/reorder`, {
        list: updateData
      });
      toast.success("Question reordered");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  }
  console.log(initialData.questions)
    return(
        <div className="relative border bg-slate-100 rounded-md p-4">
            <div className={cn(
          "text-sm mt-2",
          !initialData.questions.length && "text-slate-500 italic"
        )}>
          {!initialData.questions.length && "Tidak ada Soal"}
          <QuestionsList
            onEdit={() => {}}
            onReorder={onReorder}
            items={initialData.questions}
          />
        </div>
        </div>
    )
}
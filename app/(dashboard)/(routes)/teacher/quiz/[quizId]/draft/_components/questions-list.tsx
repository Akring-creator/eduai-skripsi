"use client";

import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuestionDialog from "./question-dialog";

// ...

interface Option {
  id: string;
  option: string;
  imageUrl: string | null;
  questionId: string;
  question: Question; // Tambahkan relasi ke Question
}

interface Question {
  id: string;
  question: string;
  imageUrl: string | null;
  answer: string;
  explanation: string;
  options: Option[]; // Tambahkan properti options dengan tipe Option[]
  quizId: string;
  position: number;
  createdAt: Date;
  updateAt: Date;
}

interface QuestionsListProps {
  items: Question[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

export const QuestionsList = ({
  items,
  onReorder,
  onEdit
}: QuestionsListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [questions, setQuestions] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setQuestions(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedQuestions = items.slice(startIndex, endIndex + 1);

    setQuestions(items);

    const bulkUpdateData = updatedQuestions.map((question) => ({
      id: question.id,
      position: items.findIndex((item) => item.id === question.id)
    }));

    onReorder(bulkUpdateData);
  };

  const toggleEdit = (questionId: string) => {
    return (
      console.log(questionId)
    )
  }

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="questions">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {questions.map((question, index) => (
              <Draggable key={question.id} draggableId={question.id} index={index}>
                {(provided) => (
                  <Card className="w-full shadow-md mb-4 gap-x-2">
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div className="flex items-center  text-slate-700 text-sm">
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    <div className="space-y-2 p-4">
                      <div className="w-full font-medium flex items-center justify-between">
                        
                        Pertanyaan {question.position + 1}
                        <QuestionDialog />

                      </div>

                      <CardHeader>
                        <CardTitle className="font-bold text-xl">
                        {question.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="justify-center mt-2">
                          {question.options.map((option) => (
                            <div key={option.id} className="option p-4 rounded-md shadow-md mb-2">
                              <p className="space-y-1 ml-5 text-slate-700 text-md">
                                {option.option}
                              </p>
                            </div>
                        ))}
                        </div>
                        </CardContent>

                    </div>

                  </div>
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                    </div>
                  </div>
                  </Card>
                )}
                
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

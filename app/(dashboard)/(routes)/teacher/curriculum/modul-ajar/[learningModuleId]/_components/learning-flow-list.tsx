'use client';

import { Chapter, LearningFlow } from '@prisma/client';
import { useEffect, useState } from 'react';
import {
  Draggable,
  Droppable,
  DragDropContext,
  DropResult,
} from '@hello-pangea/dnd';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Grip, Pencil } from 'lucide-react';

interface LearningFlowListProps {
  items: LearningFlow[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}
const LearningFlowList = ({
  items,
  onReorder,
  onEdit,
}: LearningFlowListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [learningFlows, setLearningFlow] = useState(items);

  // Mengatur masalah hidrasi
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setLearningFlow(items);
  }, [items]);

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;

    const items = Array.from(learningFlows);
    const [reorderedItem] = items.splice(result.source.index, 1);
    console.log(reorderedItem);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);

    const endIndex = Math.max(result.source.index, result.destination.index);
    const updatedChapters = items.slice(startIndex, endIndex + 1);
    setLearningFlow(items);

    const bulkUpdateData = updatedChapters.map((learningFlow) => ({
      id: learningFlow.id,
      position: items.findIndex((item) => item.id === learningFlow.id),
    }));
    onReorder(bulkUpdateData);
  }

  if (!isMounted) {
    return null;
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {learningFlows.map((learningFlow, index) => (
              <Draggable
                key={learningFlow.id}
                draggableId={learningFlow.id}
                index={index}
              >
                {(provided) => (
                  <div
                    className="flex items-center gap-x-2 bg-sky-100 border-sky-200 border text-sky-700 rounded-md mb-4 text-sm"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className="px-2 py-3 border-r border-r-sky-200 hover:bg-sky-200 rounded-l-md transition"
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {learningFlow.title}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      <Badge className="bg-sky-700">
                        Pertemuan {learningFlow.position}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(learningFlow.id)}
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                      />
                    </div>
                  </div>
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

export default LearningFlowList;

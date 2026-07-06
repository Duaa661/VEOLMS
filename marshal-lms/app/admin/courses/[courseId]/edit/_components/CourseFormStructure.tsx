"use client";

import React, { useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SortableItemProps {
  id: string;
}

function SortableItem({ id }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-3 flex cursor-grab items-center justify-between rounded-lg border bg-card p-4 shadow-sm active:cursor-grabbing"
    >
      <div className="flex items-center gap-3">
        <GripVertical
          className="h-5 w-5 text-muted-foreground"
          {...attributes}
          {...listeners}
        />
        <span>Chapter {id}</span>
      </div>
    </div>
  );
}

const CourseFormStructure = () => {
  const [items, setItems] = useState<string[]>(["1", "2", "3"]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setItems((items) => {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);

      return arrayMove(items, oldIndex, newIndex);
    });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle>Chapters</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 pt-6">
          <SortableContext
            items={items}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableItem key={item} id={item} />
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
};

export default CourseFormStructure;
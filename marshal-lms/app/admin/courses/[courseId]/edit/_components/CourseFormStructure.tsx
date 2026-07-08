"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
  Trash2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { reorderChapter, reorderforLessons } from "../action";
import NewChapterModel from "./NewChapter";
import NewLessonModal from "./NewLesson";

interface SortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => ReactNode;
  className?: string;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string;
  };
}

function SortableItem({ id, children, className, data }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn("touch-none", className, isDragging && "z-10 opacity-70")}
    >
      {children(listeners)}
    </div>
  );
}

interface CourseFormStructureProps {
  data: AdminCourseSingularType;
}
export default function CourseFormStructure({
  data,
}: CourseFormStructureProps) {
  const initialItems =
    data.chapter.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true,
      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })),
    })) ?? [];
  console.log("Intial Item ", initialItems);
  const [items, setItems] = useState(initialItems);
 useEffect(() => {
  setItems((prevItems) => {
    const updatedItems = data.chapter.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen:
        prevItems.find((item) => item.id === chapter.id)?.isOpen ?? true,
      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })),
    }));

    return updatedItems;
  });
}, [data]);
  function toggleChapter(chapterId: string) {
    setItems(
      items.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, isOpen: !chapter.isOpen }
          : chapter,
      ),
    );
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  const activeId = active.id as string;
  const overId = over.id as string;

  const activeType = active.data.current?.type as "chapter" | "lesson";
  const overType = over.data.current?.type as "chapter" | "lesson";

  const courseId = data.id;

  if (activeType === "chapter") {
    let targetChapterId: string | null = null;

    if (overType === "chapter") {
      targetChapterId = overId;
    } else if (overType === "lesson") {
      targetChapterId = over.data.current?.chapterId ?? null;
    }

    if (!targetChapterId) {
      toast.error("Could not determine the chapter for reordering.");
      return;
    }

    const oldIndex = items.findIndex(
      (item) => item.id === activeId
    );

    const newIndex = items.findIndex(
      (item) => item.id === targetChapterId
    );

    if (oldIndex === -1 || newIndex === -1) {
      toast.error("Could not find chapter old/new index for reordering.");
      return;
    }

    const reorderedLocalChapters = arrayMove(
      items,
      oldIndex,
      newIndex
    );

    const updatedChaptersForState = reorderedLocalChapters.map(
      (chapter, index) => ({
        ...chapter,
        order: index + 1,
      })
    );

    const previousItems = items;

    setItems(updatedChaptersForState);

    if (courseId) {
      const chapterToUpdate = updatedChaptersForState.map((chapter) => ({
        id: chapter.id,
        position:chapter.order
      }))
      const reorderPromise = () => 
        reorderChapter(courseId,chapterToUpdate)
      toast.promise(reorderPromise(), {
        loading: "Rordering chapers...",
        success: (result) => {
          if (result.status === 'success') return result.message;
          throw new Error(result.message)
        },
        error: () => {
          setItems(previousItems);
          return "Failed to reorder chapters"
        }
      })

    }
    return;
  }
 
  if (activeType === "lesson" && overType === "lesson") {
    const chapterId = active.data.current?.chapterId;
    const overChapterId = over.data.current?.chapterId;
    if (!chapterId || chapterId !== overChapterId) {
      toast.error(
        "Lesson move between different chapters or inavlid chapter 10 is not allowed"
      )
      return;
    }
    const chapterIndex = items.findIndex((chapter) => chapter.id === chapterId)
    if(chapterIndex===-1){
      toast.error("Could not find chapter for lesson")
      return;
    }

    const chapterToUpdate = items[chapterIndex]
    const oldLessonIndex = chapterToUpdate.lessons.findIndex(
      (lesson) => lesson.id === activeId)
    const newLessonIndex = chapterToUpdate.lessons.findIndex(
      (lesson) => lesson.id === overId)
    if (oldLessonIndex === -1) {
      toast.error("Could not find lesson for reordering");
      return;
    }
    const recordLessons = arrayMove(
      chapterToUpdate.lessons,
      oldLessonIndex,
      newLessonIndex
    )

    const updatedLessonForState = recordLessons.map((lesson, index) => ({
      ...lesson,
      order:index+1,
    }))
    const newitems = [...items]
    newitems[chapterIndex] = {
      ...chapterToUpdate,
      lessons:updatedLessonForState
    }
    const prevItems = [...items]
    setItems(newitems)
    if (courseId) {
      const lessonToUpdate = updatedLessonForState.map((lesson) => ({
        id: lesson.id,
        position:lesson.order
      }))

      const reorderLessonsPromise = () => reorderforLessons(chapterId, lessonToUpdate, courseId)
      toast.promise(reorderLessonsPromise(), {
        loading: 'Reordering Lessons',
        success: (result) => {
          if (result.status === 'success') return result.message;
          throw new Error(result.message)
        },
        error: () => {
          setItems(prevItems)
          return 'Failed to reorder lessons'
        }
      })
    }
  }
}
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Card>
        <CardHeader className="border-b flex flex-row items-center justify-between border-border">
          <CardTitle>Chapters</CardTitle>
          <NewChapterModel courseId={data.id} />
        </CardHeader>

        <CardContent className="space-y-8 pt-6">
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                data={{ type: "chapter" }}
              >
                {(listeners) => (
                  <Card>
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={() => toggleChapter(item.id)}
                    >
                      <div className="flex items-center justify-between p-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="cursor-grab opacity-60
                          hover:opacity-100"
                            {...listeners}
                          >
                            <GripVertical className="size-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="flex items-center"
                            >
                              {item.isOpen ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4"></ChevronRight>
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="cursor-pointer hover:text-primary pl-2">
                            {item.title}
                          </p>
                        </div>
                        <Button size="icon" variant="outline">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                      <CollapsibleContent>
                        <div className="p-1">
                          <SortableContext
                            items={item.lessons.map((lesson) => lesson.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {item.lessons.map((lesson) => (
                              <SortableItem
                                key={lesson.id}
                                id={lesson.id}
                                data={{ type: "lesson", chapterId: item.id }}
                              >
                                {(lessonListener) => (
                                  <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        {...lessonListener}
                                      >
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <FileText className="size-4" />
                                      <Link
                                        href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>
                                     <Button variant="outline" size="icon">
                                        <Trash2 className="size-4"/>
                                      </Button>
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          <div className="p-2">
                            <NewLessonModal chapterId={item.id} courseId={data.id} />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}

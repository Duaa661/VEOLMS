"use client";

import React from "react";
import { type Editor } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Undo2,
  Redo2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

interface MenubarProps {
  editor: Editor | null;
}

const Menubar = ({ editor }: MenubarProps) => {
  if (!editor) return null;

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border p-2 border-t-0 border-x-0">
        {/* Bold */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("bold")}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                editor.isActive("bold") && "bg-muted text-muted-foreground",
              )}
            >
              <Bold className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Bold</TooltipContent>
        </Tooltip>

        {/* Italic */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("italic")}
              onPressedChange={() =>
                editor.chain().focus().toggleItalic().run()
              }
              className={cn(
                editor.isActive("italic") && "bg-muted text-foreground",
              )}
            >
              <Italic className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Italic</TooltipContent>
        </Tooltip>

        {/* Strike */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("strike")}
              onPressedChange={() =>
                editor.chain().focus().toggleStrike().run()
              }
              className={cn(
                editor.isActive("strike") && "bg-muted text-foreground",
              )}
            >
              <Strikethrough className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Strike</TooltipContent>
        </Tooltip>

        <div className="mx-2 h-6 w-px bg-border" />

        {/* Heading 1 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 1 })}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={cn(
                editor.isActive("heading", { level: 1 }) &&
                  "bg-muted text-foreground",
              )}
            >
              <Heading1 className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Heading 1</TooltipContent>
        </Tooltip>

        {/* Heading 2 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 2 })}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={cn(
                editor.isActive("heading", { level: 2 }) &&
                  "bg-muted text-foreground",
              )}
            >
              <Heading2 className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Heading 2</TooltipContent>
        </Tooltip>

        {/* Heading 3 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 3 })}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={cn(
                editor.isActive("heading", { level: 3 }) &&
                  "bg-muted text-foreground",
              )}
            >
              <Heading3 className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Heading 3</TooltipContent>
        </Tooltip>
        {/* Bullet List */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("bulletList")}
              onPressedChange={() =>
                editor.chain().focus().toggleBulletList().run()
              }
              className={cn(
                editor.isActive("bulletList") && "bg-muted text-foreground",
              )}
            >
              <List className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Bullet List</TooltipContent>
        </Tooltip>

        {/* Ordered List */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("orderedList")}
              onPressedChange={() =>
                editor.chain().focus().toggleOrderedList().run()
              }
              className={cn(
                editor.isActive("orderedList") && "bg-muted text-foreground",
              )}
            >
              <ListOrdered className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Ordered List</TooltipContent>
        </Tooltip>

              <div className="mx-2 h-6 w-px bg-border" />
              {/* Align Left */}
        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive({textAlign:'left'})}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign('left').run()
                }
                className={cn(
                  editor.isActive({textAlign:'left'}) && "bg-muted text-foreground",
                )}
              >
                <AlignLeft className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Align Left</TooltipContent>
                  </Tooltip>

                  {/* Align Center */}
                  <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive({textAlign:'center'})}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign('center').run()
                }
                className={cn(
                  editor.isActive({textAlign:'center'}) && "bg-muted text-foreground",
                )}
              >
                <AlignCenter className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Align Center</TooltipContent>
                  </Tooltip>

                  {/* ALign Right */}
                   <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive({textAlign:'right'})}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign('right').run()
                }
                className={cn(
                  editor.isActive({textAlign:'right'}) && "bg-muted text-foreground",
                )}
              >
                <AlignRight className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Align Right</TooltipContent>
                  </Tooltip>
              </div>
              <div className="mx-2 h-6 w-px bg-border" />
       <Tooltip>
  <TooltipTrigger asChild>
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => editor.commands.undo()}
      disabled={!editor.can().undo()}
    >
      <Undo2 className="h-4 w-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent>Undo</TooltipContent>
</Tooltip>

<Tooltip>
  <TooltipTrigger asChild>
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => editor.commands.redo()}
      disabled={!editor.can().redo()}
    >
      <Redo2 className="h-4 w-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent>Redo</TooltipContent>
</Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default Menubar;

"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import type {
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";

import Menubar from "./Menubar";

interface RichTextEditorProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName>;
}

export function RichTextEditor<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({ field }: RichTextEditorProps<TFieldValues, TName>) {
  let initialContent: string | JSONContent = "<p>Hello world</p>";

  if (typeof field.value === "string" && field.value.length > 0) {
    try {
      initialContent = JSON.parse(field.value) as JSONContent;
    } catch {
      initialContent = `<p>${field.value}</p>`;
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
      },
    },
    immediatelyRender: false,
    content: initialContent,
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-input dark:bg-input/30">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
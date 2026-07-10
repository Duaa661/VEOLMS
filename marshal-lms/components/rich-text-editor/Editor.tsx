"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Menubar from "./Menubar";

export function RichTextEditor({ field }: { field: any }) {
  let initialContent: any = "<p>Hello world</p>";

  if (field.value) {
    try {
      initialContent = JSON.parse(field.value);
    } catch {
      // If it's plain text instead of JSON, render it as HTML
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
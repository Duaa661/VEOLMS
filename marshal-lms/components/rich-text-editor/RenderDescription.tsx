"use client";

import { useMemo } from "react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { generateHTML, type JSONContent } from "@tiptap/react";
import parse from "html-react-parser";

const RenderDescription = ({ json }: { json: JSONContent | null }) => {
  const output = useMemo(() => {
    if (!json) return "";

    return generateHTML(json, [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ]);
  }, [json]);

  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary">
      {parse(output)}
    </div>
  );
};

export default RenderDescription;
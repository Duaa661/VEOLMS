"use client";

import { useMemo } from "react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { generateHTML, type JSONContent } from "@tiptap/react";
import parse from "html-react-parser";

interface Props {
  json: JSONContent | string | null;
}

const RenderDescription = ({ json }: Props) => {
  const output = useMemo(() => {
    if (!json) return "";

    let content: JSONContent;

    try {
      content =
        typeof json === "string"
          ? JSON.parse(json)
          : json;
    } catch (error) {
      console.log("Invalid JSON description:", error);
      return "";
    }

    return generateHTML(content, [
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
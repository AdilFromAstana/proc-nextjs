import React, { JSX } from "react";
import { InlineMath, BlockMath } from "react-katex";

export const processTextWithRichContent = (
  text: string
): (string | JSX.Element)[] => {
  const regex = /\[(FORMULA|IMAGE):([\s\S]*?)\](?=(\s|$|[.,!?]))/g;
  const parts: (string | JSX.Element)[] = [];

  let lastIndex = 0;
  for (const match of text.matchAll(regex)) {
    const [full, type, content] = match;
    const start = match.index ?? 0;

    if (start > lastIndex) {
      parts.push(text.substring(lastIndex, start));
    }

    if (type === "FORMULA") {
      if (content.includes("\\begin{")) {
        parts.push(<BlockMath key={start} math={content} />);
      } else {
        parts.push(<InlineMath key={start} math={content} />);
      }
    } else if (type === "IMAGE") {
      parts.push(
        <img
          key={start}
          src={content}
          alt="embedded"
          className="inline-block max-h-40 mx-2"
        />
      );
    }

    lastIndex = start + full.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
};

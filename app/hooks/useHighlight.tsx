"use client";
// import hljs from "highlight.js";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { RefObject, useEffect } from "react";

type Props = {
  codeRef: RefObject<HTMLElement>;
  prop1?: Object;
  prop2?: any;
};

const useHighlight = ({ codeRef, prop1, prop2 }: Props) => {
  // useEffect(() => {
  //   if (typeof window !== "undefined" && codeRef.current) {
  //     const codeBlocks = codeRef.current.querySelectorAll<HTMLElement>("pre");

  //     codeBlocks.forEach((block) => {
  //       hljs.highlightElement(block);
  //       block.classList.add("code");
  //     });
  //   }
  // }, [prop1, prop2]);

  // return null;
  useEffect(() => {
    if (typeof window !== "undefined" && codeRef.current) {
      const codeBlocks = codeRef.current.querySelectorAll<HTMLElement>("pre");

      codeBlocks.forEach((block) => {
        // Extract the code content from the block element
        const code = block.textContent ?? "";

        // Render the code block using react-syntax-highlighter
        const lang = block.className.replace("language-", "");
        const highlightedCode: any = (
          <SyntaxHighlighter language={lang} style={docco}>
            {code}
          </SyntaxHighlighter>
        );

        // Replace the original block with the highlighted code
        block.parentNode?.replaceChild(highlightedCode, block);
      });
    }
  }, [prop1, prop2]);

  return null;
};

export default useHighlight;

"use client";
import hljs from "highlight.js";
import { ReactNode, RefObject, useEffect } from "react";

type Props = {
  codeRef: RefObject<HTMLElement>;
  prop1?: Object;
  prop2?: any;
};

const useHighlight = ({ codeRef, prop1, prop2 }: Props) => {
  useEffect(() => {
    if (window && typeof window !== "undefined" && codeRef.current) {
      const codeBlocks = codeRef.current.querySelectorAll<HTMLElement>("pre");

      codeBlocks.forEach((block) => {
        hljs.highlightElement(block);
        block.classList.add("code");
      });
    }
  }, [prop1, prop2]);

  return null;
};

export default useHighlight;

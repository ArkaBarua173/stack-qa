"use client";

import dynamic from "next/dynamic";
import { Dispatch, FormEvent, SetStateAction, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Quill from "quill";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const BlockEmbed = Quill.import("blots/block/embed");

type FormValues = {
  anwer: string;
};

type Props = {
  questionId: string;
  setAnsPrompt: Dispatch<SetStateAction<boolean>>;
};

export default function Answer({ questionId, setAnsPrompt }: Props) {
  const queryClient = useQueryClient();
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<Partial<FormValues>>({});
  class CustomCode extends BlockEmbed {
    static create(value: { lang: string; content: string }) {
      const { lang, content } = value;
      const node = super.create(value);
      const code = document.createElement("code");
      code.setAttribute("class", lang);
      code.textContent = content;
      node.appendChild(code);
      return node;
    }

    static value(node: any) {
      return {
        lang: node.firstChild.getAttribute("class"),
        content: node.firstChild.innerText,
      };
    }
  }

  CustomCode.blotName = "code-custom";
  CustomCode.tagName = "pre";
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: "1" }, { header: "2" }, { header: "3" }],
          ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
      },
    }),
    []
  );

  const onAnswerStateChange = (answerState: string) => {
    setAnswer(answerState);
  };

  const onAnswerSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const validationError = validateForm();
    if (Object.keys(validationError).length === 0) {
      setError({});
      fetch("http://localhost:3000/api/answer", {
        method: "POST",
        body: JSON.stringify({
          questionId,
          answer,
        }),
      }).then(async (res) => {
        const data = await res.json();
        queryClient.invalidateQueries(["getQuestion"]);
        setAnswer("");
        setAnsPrompt(false);
        console.log(data);
      });
    } else {
      setError(validationError);
    }
  };

  const validateForm = () => {
    const errors: Partial<FormValues> = {};
    if (answer.trim() === "") {
      errors.anwer = "Answer field is required";
    } else if (answer.length < 20) {
      errors.anwer = "Answer field should at least one line";
    }

    return errors;
  };

  return (
    <form className="flex flex-col" onSubmit={onAnswerSubmit}>
      <ReactQuill
        modules={modules}
        value={answer}
        onChange={onAnswerStateChange}
        theme="snow"
      />
      {error && <p className="text-red-700 pt-1 font-medium">{error.anwer}</p>}
      <button
        type="submit"
        className="bg-blue-700 text-white font-semibold rounded-lg shadow-sm mt-6 h-11"
      >
        Submit Answer
      </button>
    </form>
  );
}

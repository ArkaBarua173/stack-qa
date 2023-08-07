"use client";

import dynamic from "next/dynamic";
import { Dispatch, FormEvent, SetStateAction, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type FormValues = {
  anwer: string;
};

type Props = {
  questionId: string;
  setAnsPrompt: Dispatch<SetStateAction<boolean>>;
};

export default function Answer({ questionId, setAnsPrompt }: Props) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<Partial<FormValues>>({});

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
    setIsLoading(true);
    const validationError = validateForm();
    if (Object.keys(validationError).length === 0) {
      setError({});
      axios
        .post("/api/answer", { questionId, answer })
        .then((res) => {
          if (res.status === 200) {
            queryClient.invalidateQueries(["getAnswers", "getQuestion"]);
            setAnswer("");
            setAnsPrompt(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setError(validationError);
    }
    setIsLoading(false);
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
        {isLoading ? "loading..." : "Submit Answer"}
      </button>
    </form>
  );
}
